import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Header, TopBar, Footer} from '../components/common'
import { WizScoreWeightings } from '../components/wizscore';
import axios from 'axios';
import config from '../config.json'

const API_URL = process.env.API_BASE_URL;

const getStake = async () => {
    axios(API_URL+config.API_ENDPOINTS.gossip_stake, {
        headers: {'Content-Type':'application/json'}
    })
      .then(response => {
        let json = response.data;
        
        return json;
      })
      .catch(e => {
        console.log(e);
      })
      return null
}

export default function Home() {


    return (
        <div>
            <Header
                title="Restart Tracker - Stakewiz"
            />

            <main>
                <TopBar />

                
                    <div className='container'>         
                        <div className='text-center'>
                            <h2 className='text-white'>Network has restarted.</h2>
                            <h4 className='text-white my-5'>While block production has resumed many websites, dapps and wallets rely on RPC Nodes which also need to restart so it may take some more time until all services are restored.</h4>
                        </div>             
                        <div className='text-center text-white fs-6 my-3'>
                            <p>This display was rapidly built to provide insight into the restart. It receives data directly from our validator log every 5 seconds, refresh to update.</p>
                            <p>Built by <a href='http://laine.co.za/solana' target='_new'>Laine</a> - a Solana Validator</p>
                            <p>Join our Discord <a href='https://discord.gg/4jWhWZX7ef' target='_new'>here</a></p>
                            <p>Information is provided without warranty for it&apos;s accuracy.</p>
                        </div>         
                    </div>     
               
            </main>

            <Footer />
        </div>
    )
}