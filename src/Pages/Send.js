import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom/dist';
import { useAccount, useNetwork } from 'wagmi'
import cancel from '../Components/cancel.png'
import giphy from '../Components/watching-eyes.gif'
import Header from '../Components/Header';
import Footer from '../Components/Footer';


import './send.css'

const Send = () => {
    const [searchParams] = useSearchParams();
    const [rAddress, setRAddress] = useState(searchParams.get("address"));
    const [ amount, setAmount ] = React.useState();
    const [ popupState, setPopupState ] = React.useState(false);
    const [ acctBalance, setAcctBalance ] = React.useState()
    
    const [ transactionStatus, setTransactionStatus ] = React.useState(false)
    const [ status, setStatus ] = React.useState()
    const [ errorMsg, setErrorMsg ] = React.useState()
    const navigate = useNavigate()

    const { address, isConnected } = useAccount()
    const { chain } = useNetwork()
    


    function amountInput (e) {
        setAmount(e.target.value)
    }
    function closePopup(){
        setPopupState(false);
    }

    async function handleInputSend() {
        let getAmount = amount
        
        if(Number(getAmount) > Number(amount)) {
            await console.log(rAddress)
            .then(setTransactionStatus(true))
            .then(setStatus(`You sent ${amount} USDC to ${address} successfully`))
        } else {
            setErrorMsg(`Oops you don't have up to ${amount} USDC in your wallet`)
            setPopupState(true)
        }

    }

    useEffect(() => {
        if (!rAddress) {
            navigate('/')
        }
        /*
        async function getData(){
            let Data = await window.account.state()
            setAcctBalance(Data.amount)
        }
        getData() */
    }, [acctBalance])

    return (
        <>
            <Header />

            {
            (!isConnected)?
                <div className="full-card card-edit">
                    <img src={giphy} className='giphy'/>
                    <div className="before-login">Please Log In</div>
                </div>
                
                :
                <section>
                    <div style={ transactionStatus ? { display : 'none' } : { display : 'block' }}>
                        <div className="send-card" style={ popupState ? { opacity : '.1' } : { opacity : '1' }} >
                            <div className='send-card-body'>
                                <div style={ { display : 'block' } }>
                                    <div> 
                                        <div>
                                            You are about to send USDC to <span> {rAddress}</span>
                                        </div>
                                        <div>
                                            <input className="text-input amount" placeholder="Amount" onChange={amountInput} />
                                            <div className='btn-wrap'><button className="send-submit submit-input" onClick={handleInputSend}>Send</button></div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="send-card full-card" style={ transactionStatus ? { display : 'block' } : { display : 'none' }}>
                        {status}
                    </div>
                    <div className='popup'  style={ popupState ? { display : 'block' } : { display : 'none'}}>
                        <div className='cancel-wrap'><img src={cancel} onClick={closePopup} className='cancel-btn' /></div>
                        <div className='popup-body status'>
                            {errorMsg}
                        </div>
                    </div>
                </section>
            }


            <Footer />
        </>
    )
}

export default Send