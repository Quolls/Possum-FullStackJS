import { Models } from "appwrite";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import "../../components/Pagination/Pagination.css";
const Home = () => {
  // const { toast } = useToast();

  // State for managing current page
  const [currentPage, setCurrentPage] = useState(1);
  // Number of posts per page
  const postsPerPage = 4;

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  // const {
  //   data: creators,
  //   isLoading: isUserLoading,
  //   isError: isErrorCreators,
  // } = useGetUsers(10);

  // Calculate the current posts to display
  // 确定当前页应显示的帖子
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    posts?.documents?.slice(indexOfFirstPost, indexOfLastPost) ?? [];

  // Change page handler
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }
  // 计算总页数
  const totalPages = Math.ceil((posts?.documents?.length ?? 0) / postsPerPage);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <div className="flex-between w-full max-w-5xl mb-7">
            <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
            <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
              <p className="small-medium md:base-medium text-light-2">All</p>
              <img
                src="/assets/icons/filter.svg"
                width={20}
                height={20}
                alt="filter"
              />
            </div>
          </div>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <>
              <ul>
                {currentPosts.map((post: Models.Document) => (
                  <li key={post.$id}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        if (currentPage > 1) paginate(currentPage - 1); // 仅在当前页大于1时才能向前翻页
                        e.currentTarget.blur(); // 点击后移除焦点
                      }}
                      className={
                        currentPage === 1
                          ? "disabled-linkpagination-button"
                          : "pagination-button"
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages).keys()].map((number) => (
                    <PaginationItem key={number}>
                      <PaginationLink
                        onClick={() => paginate(number + 1)}
                        className={
                          currentPage === number + 1 ? "active-page" : ""
                        }>
                        {number + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) paginate(currentPage + 1); // 仅在当前页小于总页数时才能向后翻页
                      }}
                      className={
                        currentPage === totalPages ? "disabled-link" : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      </div>
      {/* <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
};

export default Home;
