import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
	const {data:authuser,isLoading} = useQuery({
		queryKey:["authuser"],
		queryFn:async ()=>{
			try {
				const res = await fetch("api/auth/getme", {
					method: "GET",
				})

				const data = await res.json()
				if (data.error) {
					return null
				}
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}

				
				console.log("authUSer --> ",data);
				return data

			} catch (error) {
				console.log(error.message);
				throw error
			}
		
		},
		retry:false
	})

	if (isLoading){
		return (
			<div className="h-screen flex justify-center item-center">
				<LoadingSpinner size="lg"/>
			</div>
		)
	}
	return (
		<div className='flex max-w-6xl mx-auto'>
			{authuser && <Sidebar />}
			<Routes>
				<Route path='/' element={ authuser ? <HomePage />:<Navigate to="/login"/>} />
				<Route path='/signup' element={ !authuser ? <SignUpPage /> :<Navigate to="/" /> } />
				<Route path='/login' element={ !authuser ? <LoginPage />:<Navigate to="/" /> } />
				<Route path='/notifications' element={ authuser ?<NotificationPage />: <Navigate to="/login" />} />
				<Route path='/profile/:username' element={ authuser ? <ProfilePage />: <Navigate to="/login" />} />


			</Routes>
			{authuser && <RightPanel />}
			<Toaster/>
		</div>
	);
}

export default App
