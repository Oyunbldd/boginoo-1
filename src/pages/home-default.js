import React, { useContext, useState } from 'react';
import { Layout, Button, Input, Logo, Boginosson, History} from '../components';
import { Context } from '../Providers/provider'
import { useHistory } from 'react-router-dom'
import { auth, db, firebase } from '../components/firebase'
import Randomstring from 'randomstring'
import { AuthContext } from '../Providers/auth-user-provider';
export const HomeDefault = () => {
    const history = useHistory();
    const { drop, setDrop, isHistory, setIsHistory } = useContext(Context);
    const { user } = useContext(AuthContext);
    const logout = () => {
        localStorage.setItem('remember', 'false');
        auth.signOut();
        setDrop(false);
    }
    const [url, setUrl] = useState({
        bogino: '',
        urt: ''
    })
    const [errorMessage, setErrorMessage] = useState('');
    const boginosgoh = async () => {
        if (url.urt.length > 7 && url.urt.substring(0, 4) === 'http') {
            setErrorMessage('');
            const random = Randomstring.generate(7);
            const path = 'https://boginoo-1.web.app/' + random;
            setIsHistory(false);
            setUrl({...url, bogino: path});
            await db.collection('shorted').doc(random).set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                user: user.email,
                inputUrl: url.urt,
                outputUrl: path,
            });
        }else {
            setErrorMessage('Урт нь 7 оос их эхлэл нь заавал http гээр эхэлсэн бүрэн веб үрл байх хэрэгтэй!');
        }
    }
    return (
        <Layout>
            <div className='h100 flex-center relative'>
                <div className={`drop ${drop ? '' : 'hide'} absolute w-7`}>
                    <div className="font-ubuntu bold text-center pa-3 fs-20 lh-23 b-primary c-default br-8" onClick={logout}>Гарах</div>
                </div>
                <Logo />
                <div className='font-lobster c-primary fs-56 lh-70 text-center normal' onClick={() => history.push('/')}>
                    Boginoo
                </div>
                <div className='mt-5 flex justify-center items-center flex-wrap'>
                    <Input placeholder='https://www.web-huudas.mn' className="w-9 h-5 ph-5" onChange={(e) => setUrl({urt: e.target.value, bogino: ''})} value={url.urt}/>
                    <Button onClick={boginosgoh} className={`pointer ${url.urt === '' ? 'disabled' : ''}`}>Богиносгох</Button>
                </div>
                {
                    errorMessage && (
                        <div className='mt-5 flex-center'>
                            <p className='word-break c-error font-ubuntu'>{errorMessage}</p>
                        </div>
                    )
                }
                {
                    url.bogino !== '' && (
                        <Boginosson urt={url.urt} bogino={url.bogino}/>
                    )
                }
                {
                    isHistory && (
                        <History />
                    )
                }
            </div>
        </Layout>
    )
}