// import { Models } from "appwrite";

// import { useToast } from "@/components/ui/use-toast";
// import { Loader, PostCard  } from "@/components/shared";
// import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";

const Home = () => {
  // const { toast } = useToast();

  // const {
  //   data: posts,
  //   isLoading: isPostLoading,
  //   isError: isErrorPosts,
  // } = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          <ul className="flex flex-col flex-1 gap-9 w-full "></ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
