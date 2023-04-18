import { useDispatch, useSelector } from "react-redux";
import { GrLocation } from 'react-icons/gr';
import { getUserAd } from '../../actions/adActions';
import { logout } from "@/actions/userActions";
import { FaUserAlt } from 'react-icons/fa';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { FiPhoneCall } from 'react-icons/fi';
import { Loader, CardLoader } from '@/components/layout/Loader';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import useSWR from 'swr'
import MapCaller from '@/components/Map';
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react'
import { useEffect } from "react";

const Profile = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const session = useSession();
    useEffect(() => {
        if(session.status === 'unauthenticated') router.push({ pathname: "/"});
    }, [session.status])

    const { loading: adloading, ads } = useSelector((state) => state.getads);

    const { data, error } = useSWR("Get Ads", () => dispatch(getUserAd()))

    const handleClick = async (e) => {
        e.preventDefault();
        const res = await signOut({ redirect: false });
        router.push({ pathname: "/"});
        // toast('Logout out Successfully !')
    }
    
    return (
        <div className="profile-section">
            <div className="profile">
                <div className="left">
                    <img src="/home.png" />
                </div>
                <div className="right">
                    {session.status === 'loading' ? (<Loader/>) : (
                        <form className="form">
                        <h3 className="heading">Profile</h3>
                    
                        {session.data && session.data.user ? (
                            <>
                                <div><FaUserAlt style={{color: 'black', fontSize: '25px', marginRight: '13px'}}/>{session.data.user.username}</div>
                                <div><MdOutlineAlternateEmail style={{color: 'black', fontSize: '25px', marginRight: '13px'}}/>{session.data.user.email}</div>
                                <div><FiPhoneCall style={{color: 'black', fontSize: '25px', marginRight: '13px'}}/>+91 {session.data.user.contact}</div>
                            </>
                            ) : (
                            <h3>Please Sign in first</h3>
                        )}

                        <button onClick={() => router.push({ pathname: "profile/update" })}>Update</button>
                        <button onClick={handleClick} className="logout-btn">Log out</button>
                    </form>
                    )} 
                </div>
            </div>
            <div className="post-ad-section">
                <h3 className="heading">Your Advertisements</h3>
                <button onClick={() => router.push('/postad')} type="submit">Post New Advertisement</button>
            </div>
            <div>
            {adloading ? (<CardLoader/>) : (
            ads.length > 0 ? (
                ads.map((ad, index) => 
                    <div className="cards">
                        <div className="card">
                            <div className="top">
                                <img className="image" src="/house.jpg" />
                                <div className="data">
                                    <div className="head">
                                        <div className="head-data">
                                            <span className="title">{ad.ad_title}</span>
                                            <div class="section">
                                                <span className="city">{ad.city} - </span>
                                                <span className="pincode">{ad.pincode} | </span>
                                                <span className="createdAt">{ad.createdAt.substring(0,10)} |</span>
                                                <div>
                                                    
                                                    <input type="checkbox" className="modal-btn" id="modal-btn" name="modal-btn"/>
                                                    <label for="modal-btn"  onClick={() => {
                                                        document.querySelector(`.modal${index}`).classList.add('y');
                                                        document.querySelector(`.modal-wrap${index}`).classList.add('s');

                                                    }}>Show in maps</label> 		
                                                    <div className={`modal modal${index}`} >
                                                        <div className="modal-close-btn">
                                                            <button className="modal-close" onClick={() => {
                                                            document.querySelector(`.modal${index}`).classList.remove('y');
                                                            document.querySelector(`.modal-wrap${index}`).classList.remove('s')}}>X</button>
                                                        </div>
                                                        <div className={`modal-wrap modal-wrap${index}`}>	
                                                        <MapCaller ad={[ad]} />
                                                        </div>			          		
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <a className="edit-btn" href={`/ads/update/${ad.id}`}>Edit</a>
                                        <span className="price">$ {ad.price}</span>
                                    </div>
                                    <div className="room-info">
                                        <div className="room-data"><img className="room-icon" src="/room-icon.png"/><span className="living_room">{ad.living_rooms}</span></div>
                                        <div className="room-data"><img className="room-icon" src="/bathroom-icon.png"/><span className="bath_room">{ad.bath_rooms}</span></div>
                                        <div className="room-data"><img className="room-icon" src="/bedroom-icon.png"/><span className="bed_room">{ad.bed_rooms}</span></div>
                                        <div className="room-data"><img className="room-icon" src="/kitchen-icon.png"/><span className="kitchens">{ad.kitchens}</span></div>
                                    </div>
                                    <p className="description">{ad.description}</p>
                                </div>
                            </div>
                            <div className="bottom">
                                <span><GrLocation style={{color: 'black', fontSize: '25px', marginRight: '13px'}}/>
                                {ad.addressL1}, {ad.addressL2}, {ad.city}, {ad.state}, {ad.country}</span>
                                <span><FiPhoneCall style={{color: 'black', fontSize: '25px', marginRight: '13px'}}/>{ad.contact}</span>
                            </div>
                        </div>
                    </div>
              )) 
              : (<h1>No data</h1>)
        )}
        </div>     
        </div>
    )
}

export default Profile