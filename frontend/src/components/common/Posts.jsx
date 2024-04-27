import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { useEffect } from "react";

const Posts = ({ feedType }) => {

	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "api/post/allpost"
			case "following":
				return "api/post/following"
			default:
				return "api/post/allpost"
		}
	}

	const Post_endpoint = getPostEndpoint()
	console.log(Post_endpoint, 19);
	const { data: POSTS, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				console.log(24);
				const res = await fetch(Post_endpoint)

				const data = await res.json()
				console.log(data, 27);
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				return data
			} catch (error) {
				throw new Error(error)
			}

		}
	})

	useEffect(() => {
		refetch()
	}, [feedType, refetch])
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading  && !isRefetching && POSTS && (
				<div>
					{POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;