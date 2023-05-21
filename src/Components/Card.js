import React, { useEffect } from 'react';
import {
    useAccount,
  } from 'wagmi'
import './card.css';
import cancel from './cancel.png'
import QRCode from 'qrcode';
import {saveAs} from "file-saver";
import giphy from './watching-eyes.gif'


export default function Card() {
    const { address, isConnected } = useAccount()

    const [ switch1, setSwitch1 ] = React.useState(true);
    const [ switch2, setSwitch2 ] = React.useState(false);
    const [ popupState, setPopupState ] = React.useState(false);
    const [ url, setUrl ] = React.useState(`${window.location.href}send?address=${address}&chain=Goerli`)
    const [ qr, setQr ] = React.useState("")

    const [rChain, setRChain] = React.useState("Goerli");
    
    const GenerateQRCode = () => {
        QRCode.toDataURL(
            url,
            {
                width: 300,
                margin: 2,
                color: {
                    dark: "#000",
                    light: "#fff",
                },
            },
            (err, url) => {
                if (err) return console.log(err)
                setQr(url)
            }
        );
    };

    //None
    
    function turnOn1(){
        setSwitch2(false);
        setSwitch1(true);
    }

    function turnOn2(){
        setSwitch1(false);
        setSwitch2(true);
    }

    function generateCode(){
        generateModifiedQR()
        setPopupState(true)
    }

    function closePopup(){
        setPopupState(false);
    }

    function handleDownload() {
        saveAs(qr, `${address}${rChain}.png`)
    }
    
    function generateModifiedQR() {
        setUrl(`${window.location.href}send?address=${address}&chain=${rChain}`)
        GenerateQRCode()
        return
    }

    function rChainChange(e){
        setRChain(e.target.value)
        generateModifiedQR();
    }

    useEffect(() => {
        console.log(rChain)
        GenerateQRCode();

    }, [rChain, url])

    return (
        <>
        {
            (!isConnected)?
                <div className="full-card card-edit">
                    <img src={giphy} className='giphy'/>
                    <div className="before-login">Please Log In</div>
                </div>
                
                :
                <section>
                    <div className="full-card" style={ popupState ? { opacity : '.1' } : { opacity : '1' }}>
                        <div className='card-header'>
                            <div onClick={turnOn1} className='switch switch1' style={ switch1 ? { borderBottom : '3px solid black' } : {}}>
                                RECEIVE
                            </div>
                            <div onClick={turnOn2} className='switch switch2' style={ switch2 ? { borderBottom : '3px solid black' } : {}}>
                                SEND
                            </div>
                        </div>
                        
                        <div  className='card-body'>
                            <div style={ switch1 ? { display : 'block' } : { display : 'none' }}>
                                <div>Generate and share QR code to receive payment in USDC</div>
                                <div className='qr'>
                                    {qr && (
                                        <>
                                            <img src={qr} className='qr-image' />
                                        </>
                                    )}
                                </div>
                                <div>
                                    <select className="text-input" onChange={rChainChange} value={rChain}>
                                        <option label="Fuji" value="Fuji">Fuji</option>
                                        <option label="Goerli" value="Goerli">Goerli</option>
                                    </select>
                                    <button className="submit-input" onClick={generateCode}>Generate code</button>
                                </div>
                            </div>
                            <div style={ switch2 ? { display : 'block' } : { display : 'none' }}>
                                Send to bank
                            </div>
                        </div>
                    </div>
                    <div className='popup'  style={ popupState ? { display : 'block' } : { display : 'none'}}>
                        <div className='cancel-wrap'><img src={cancel} onClick={closePopup} className='cancel-btn' /></div>
                        <div className='popup-body'>
                            <div className='popup-qr-code'>
                                    {qr && (
                                        <>
                                            <img src={qr} className='popup-qr-image' />
                                            <div className='popup-share-div'>
                                                <button className='popup-share'>Share</button>
                                                <button onClick={handleDownload} className='popup-share'>
                                                    Download
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                        </div>
                    </div>
                </section>
        }
        </>
    )
}
