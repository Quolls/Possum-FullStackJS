import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
// import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "../StorySwiper/StorySwiper.css";
import { EffectCube, Scrollbar, Autoplay, Navigation } from "swiper/modules";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
      {post.imageS && post.imageS.length > 0 ? (
        <div className="overflow-hidden">
          <Swiper
            autoHeight={true} // 自动调整高度
            resizeObserver={true}
            effect={"cube"}
            grabCursor={true}
            cubeEffect={{
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            centeredSlides={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            scrollbar={{ hide: true }}
            // if you wanna cube, add EffectCube in the following list
            modules={[Autoplay, Navigation, Scrollbar]}
            slidesPerView={1}
            className="mySwiper">
            {post.imageS.map(
              (
                imageUrl: string,
                index: number // Explicitly declare types here
              ) => (
                <SwiperSlide key={index} className="overflow-hidden">
                  <img
                    src={imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt={`post image ${index}`}
                    className="post-card_img"
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      ) : (
        <img
          src={"/assets/icons/profile-placeholder.svg"}
          alt="default post image"
          className="post-card_img"
        />
      )}

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
