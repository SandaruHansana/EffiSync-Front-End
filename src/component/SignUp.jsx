import React, { useState } from 'react';
import { db } from './Firebase';
import { Link } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dbRef = collection(db, "Auth");

    const signUp = async (e) => {
        e.preventDefault();
        try {
            // Check if the email already exists
            const q = query(dbRef, where("Email", "==", email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                window.alert("You already have an account");
                return;
            }

            // If email doesn't exist, create a new account
            await addDoc(dbRef, { Name: name, Email: email, Password: password });
            window.alert("Successfully signed up!");
            console.log("Document successfully written!");
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen' style={{ backgroundColor: '#02041C  ' }}>
            <div className='shadow-[0px_4px_28px_3px_rgba(1,1,1,1.00)] rounded-[43px] bg-white flex flex-col md:flex-row'>
                <div className='w-[300px] h-[300px] md:w-[400px] md:h-[500px]'>
                    <h2 className='text-2xl font-bold text-center mt-8 md:mt-16'>Hello!</h2>
                    <h4 className=" text-center">Enter Details below to Register to EffiSync</h4>
                    <div className='flex justify-center'>
                        <form className='max-w-sm mx-auto mt-5' onSubmit={signUp}>
                            <div className='mb-5'>
                                <input type='text' id='name' style={{ width: '250px' }} className='bg-gray-400 border text-sm md:text-base rounded-lg block p-2.5 md:p-3 dark:placeholder-gray-500 dark:text-white' placeholder='Name' required onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mb-5'>
                                <input type='email' id='email' style={{ width: '250px' }} className='bg-gray-400 border text-sm md:text-base rounded-lg block p-2.5 md:p-3 dark:placeholder-gray-500 dark:text-white' placeholder='Email' required onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='mb-5'>
                                <input type='password' id='password' style={{ width: '250px' }} className='bg-gray-400 border text-sm md:text-base rounded-lg block p-2.5 md:p-3 dark:placeholder-gray-500 dark:text-white' placeholder='Password' required onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className='flex justify-center'>
                                <button type='submit' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:text-base px-5 py-2.5 md:py-3 md:text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>SignUp</button>
                            </div>
                            <p>Already have an account?  <Link to='/Account' style={{ fontFamily: 'Bazooka' }}>Sign in</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
