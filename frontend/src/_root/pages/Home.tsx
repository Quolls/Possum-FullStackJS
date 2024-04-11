import { Models } from "appwrite";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard } from "@/components/shared";
import { useGetRecentPosts } from "@/lib/react-query/queries";
import "../../components/Pagination/Pagination.css";
const Home = () => {
  // const { toast } = useToast();

  // State for managing current page
  const [currentPage, setCurrentPage] = useState(1);
  // Number of posts per page
  const postsPerPage = 10;

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  // 新的状态用于控制ScrollArea的显示
  const [showScrollArea, setShowScrollArea] = useState(false);
  // Toggle函数用于切换ScrollArea的显示状态
  const toggleScrollArea = () => {
    setShowScrollArea((prevState) => !prevState); // 使用函数式更新
  };

  // tags
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("All"); // 新增状态

  // 从帖子数据中提取并处理标签
  useEffect(() => {
    if (posts && posts.documents) {
      const tags = posts.documents
        .flatMap((post) => post.tags)
        .filter((value, index, self) => self.indexOf(value) === index);
      setUniqueTags(tags);
    }
  }, [posts]);

  // Calculate the current posts to display
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
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
  // 根据selectedTag过滤帖子
  const filteredPosts =
    selectedTag === "All"
      ? posts?.documents ?? []
      : posts?.documents?.filter((post) => post.tags.includes(selectedTag)) ??
        [];

  // 重新计算总页数，基于过滤后的帖子数量
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // 更新按钮文本的逻辑，确保“所有”按钮正确显示选中的标签或默认文本
  const buttonText =
    selectedTag === "All"
      ? "All"
      : selectedTag.length > 10
      ? `${selectedTag.slice(0, 10)}...`
      : selectedTag;

  // 使用filteredPosts计算当前页面显示的帖子
  const currentFilteredPosts = filteredPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <div className="flex-between w-full max-w-5xl mb-7">
            <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
            <div
              className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer"
              onClick={toggleScrollArea}>
              <p className="small-medium md:base-medium text-light-2">
                {buttonText}
              </p>
              <img
                src="/assets/icons/filter.svg"
                width={20}
                height={20}
                alt="filter"
              />
              {selectedTag !== "All" && (
                <div
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发toggleScrollArea
                    setSelectedTag("All");
                    setCurrentPage(1);
                  }}
                  className="cursor-pointer">
                  ×
                </div>
              )}
            </div>
          </div>
          {showScrollArea && (
            <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 my-4">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                {uniqueTags.map((tag) => (
                  <React.Fragment key={tag}>
                    <div
                      onClick={() => {
                        setSelectedTag(tag);
                        setCurrentPage(1); // 筛选后跳转到第一页
                        setShowScrollArea(false);
                      }}
                      className="text-sm cursor-pointer">
                      {tag}
                    </div>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
          )}
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <>
              <ul>
                {currentFilteredPosts.map((post: Models.Document) => (
                  <li key={post.$id} style={{ marginBottom: "10px" }}>
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
                          ? "disabled-link pagination-button"
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
    </div>
  );
};

export default Home;
