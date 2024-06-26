import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import LoadingSpinner from "./LoadingSpinner";
import useFollow from "../../hooks/useFollow";

const RightPanel = () => {
	const isLoading = false;
	const {data:Suggesteduser,isPending} = useQuery({
		queryKey:["suggestedUser"],
		queryFn: async ()=>{
			try {
				const res = await fetch(`api/users/suggested`)

				const data = await res.json()

				if (!res.ok){
					throw new Error(data.error || "Something went wrong")
				}

				return data
			} catch (error) {
				throw new Error(error)
			}
		}
	})

	const { follow, isPending :followPending } = useFollow();
	if (Suggesteduser?.length === 0){
		return (
			<div className="md:w-64 w-0"></div>
		)
	}
	// const HandleSubmit = async (id)=>{
	// 	console.log(id,36);
	// 	await followUser(id)
	// }

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isPending && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					 )} 
					{!isPending &&
						Suggesteduser?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e)=>{
											e.preventDefault()
											follow(user._id)
										}}
									>
										{followPending? <LoadingSpinner size="sm"/> :"Follow"}
									</button>
								</div>
							</Link>
						 ))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;