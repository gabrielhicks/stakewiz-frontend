import React, {useEffect, useState, FC, useCallback} from 'react';
import { Connection, StakeProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Modal, Button, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider'
import config from '../../config.json';

export const getStakeAccounts = async (pubkey,connection: Connection) => {

    const stakes = await connection.getParsedProgramAccounts(
        StakeProgram.programId,
        {
            commitment: "confirmed",
            filters: [
                {
                memcmp: {
                    bytes: pubkey,
                    offset: 12
                }
            }
            ]
        }
    )


    return stakes;
}

export const StakeInput: FC<{
    balance: number;
    minStakeAmount: number;
    stakeAmount: number;
    updateAmount: Function;
    readOnly?: boolean;
}> = ({balance, minStakeAmount, stakeAmount, updateAmount, readOnly}) => {
    

    const [sliderValue, setSliderValue] = useState(stakeAmount);
    const [pendingValue, setPendingValue] = useState(null);

    const processUpdate = (amount) => {
        if(!readOnly) {
            updateAmount(amount);
            setSliderValue(amount);
        }
    }

    useEffect(() => {
        if(pendingValue!=null) {
            const timeoutId = setTimeout(() => processUpdate(pendingValue), 500)
            return () => clearTimeout(timeoutId)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingValue])

    return (
        <div className='my-2 d-flex flex-row align-items-center pe-0 w-100' key={'range-slider-div-'+stakeAmount}>
            <div className='me-1 flex-shrink-1'>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip>
                            The min amount for rent exemption + 1 lamport per validator
                        </Tooltip>
                    } 
                >
                    <span onClick={() => processUpdate(minStakeAmount/LAMPORTS_PER_SOL)} className={(!readOnly) ? 'pointer' : ''}>Min</span>
                </OverlayTrigger>
            </div>
            <div className='flex-grow-1 px-1'>
                <RangeSlider 
                    value={(pendingValue != null) ? pendingValue : sliderValue} 
                    min={minStakeAmount/LAMPORTS_PER_SOL}
                    max={(balance-config.TX_RESERVE_LAMPORTS)/LAMPORTS_PER_SOL} 
                    step={500000/LAMPORTS_PER_SOL}
                    onChange={(event) => setPendingValue(parseFloat(event.target.value))}
                    tooltip='off'
                    variant='light'
                    disabled={(readOnly) ? true : false}
                />
            </div>
            <div className='text-start px-0 flex-shrink-1'>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip>
                            Your balance minus ◎ 0.01 for fees
                        </Tooltip>
                    } 
                >
                    <span onClick={() => processUpdate((balance-config.TX_RESERVE_LAMPORTS)/LAMPORTS_PER_SOL)} className={(!readOnly) ? 'pointer' : ''}>Max</span>
                </OverlayTrigger>
            </div>
        </div>
        
    )

}