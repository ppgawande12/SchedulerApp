import dynamic from "next/dynamic";

const CreatePostsPage = dynamic(() => import("./PostForm"), { ssr: false });

export default CreatePostsPage;
