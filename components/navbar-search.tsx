import React, {useState, FC} from 'react';
import Link from 'next/link';
import { ValidatorData, WalletValidator } from './common';
import { useWallet} from '@solana/wallet-adapter-react'
import config from '../config.json';

const API_URL = process.env.API_BASE_URL;

interface ValidatorData {
  name: string;
  vote_identity: string;
  identity: string,
  activated_stake : string,
  image : string
}

  export const ValidatorFilterData: FC<{
    filterValidator: ValidatorData; 
  }> = (props) => {
    return (
      <>
        <li className="item">
          <Link
            href={"/validator/" + props.filterValidator.vote_identity}
            passHref
            >
            <a>
            {(props.filterValidator.image) && 
              <div className="product-img">
                <img
                  src= {(props.filterValidator.image)}
                  alt=""
                />
              </div>
            }
              <div className="product-info">
                <div className="product-title">
                    {props.filterValidator.name}
                  
                </div>
                <div className={`scroll-description ${(!props.filterValidator.image) ? 'scroll-descrip-full-Width' : ''}`}>
                  <span className="product-description text-truncate">
                    <b>Identity:</b>&nbsp;{props.filterValidator.identity}
                  </span>
                  <span className="product-description text-truncate">
                    <b>Vote Identity:</b>&nbsp;
                    {props.filterValidator.vote_identity}
                  </span>
                  <span className="product-description">
                    <b>Activated Stake:</b>&nbsp;
                    {props.filterValidator.activated_stake}
                  </span>
                </div>
              </div>
              </a>
              </Link>
              <div className="clrFix"></div>
        </li>
      </>
    )

  }

  const NavbarSearch: FC<{
    mobilehide : string,
    elementID : string,
    validatorList : string[],
    showSearchValidators : boolean,
    onFocusApiLoaded : boolean
    }> = (props) => {
    const [hasFilterData, setHasFilterData] = useState(false);
    const [searchValidators, setSearchValidators] = useState([]);
    const [searchFilterValidators, setSearchFilterValidators] = useState([]);
    const [searchWalletValidators, setSearchWalletValidators] = useState([]);
    const [showSearchValidators, setShowSearchValidators] = useState(false);
    const [onFocusApiLoaded, setOnFocusApiLoaded] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    let {connected, publicKey} = useWallet();
    const getValidator = async() => {
      if(!onFocusApiLoaded){
        const validatorList:any = await ValidatorData();
        const pubkey = (connected) ? publicKey.toString() : null
        const validatorWalletList:any = await WalletValidator(pubkey);
        setSearchValidators(validatorList)
        setSearchWalletValidators(validatorWalletList)
        setOnFocusApiLoaded(true)
      }
    }

    const doSearch = async(key, searchTitle) => {
        setSearchInput(searchTitle)
        const filteredValidators = [];
        if(searchTitle.length > config.DEFAULT_SEARCH_KEY_COUNT){
          for (let i = 0; i < searchValidators.length; i++) {
            
            let stakeRatio = searchValidators[i].stake_ratio*1000;
            let commission = searchValidators[i].commission;
            let name = searchValidators[i].name;
            let txtValue = searchValidators[i].name + searchValidators[i].identity + searchValidators[i].vote_identity;
            let vote_identity = searchValidators[i].vote_identity;
            
            if (txtValue.toUpperCase().indexOf(searchTitle.toUpperCase()) > -1 ) {
                if((name=='')) {
                  continue;
                }
                else{
                  if(searchWalletValidators.length > 0) {
                    if(!searchWalletValidators.includes(vote_identity)) continue;
                  }
                  let sf = "rank_asc"
                  sf = sf.substring(0,sf.length-4);
                  filteredValidators.sort((a,b) => (a[sf] > b[sf]) ? 1 : ((b[sf] > a[sf]) ? -1 : 0));
                  filteredValidators.push(searchValidators[i]);
                }
            }   
        }
          if(filteredValidators.length > 0){
            setHasFilterData(true)
          }
          else{
            setHasFilterData(false)
          }
          setSearchFilterValidators(filteredValidators)
          setShowSearchValidators(true)
        }
        else{
          setShowSearchValidators(false)
        }
    }
 
  return (
    <>
      <div className={`search-container ${props.mobilehide}`} >
          <input className={`search expandright ${(showSearchValidators) ? 'src-active' : ''}`} id={props.elementID} type="search" name="search" placeholder="Search validators..."        
            onFocus={(e) => {getValidator()}} onChange={(e) => {doSearch(e.target.name, e.target.value)}}  autoComplete="off" value={searchInput} />
          <label className="btnSearch searchbtn" htmlFor={props.elementID}>
            <span className="mglass">⚲</span></label>
        {(hasFilterData && showSearchValidators) ?
            <div className="elastic-search-result-div scrollSrc">
                  <ul className="products-list product-list-in-box">
                    <div className="search-result-heading"></div>
                      {  searchFilterValidators.map((validator) =>
                        <ValidatorFilterData
                        key={validator.identity}
                        filterValidator={validator}
                      />
                    )}
                  </ul>
            </div>
            : (!hasFilterData && showSearchValidators) ? 
                <div className="elastic-search-result-div scrollSrc">
                   No Results Found
                </div>
            : null
        }
      </div>
    </>
  )

}
export default NavbarSearch;