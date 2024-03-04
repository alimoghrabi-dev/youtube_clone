import Sidebar from "@/components/layout/Sidebar";
import FetchUserContainer from "@/components/shared/FetchUserContainer";
import VideoUserContainer from "@/components/shared/VideoUserContainer";
import { getVideosAccoringToQuery } from "@/lib/actions/video.actions";
import { Video, User } from "@prisma/client";

const Results = async ({
  searchParams,
}: {
  searchParams: { query: string };
}) => {
  const videosAndUsers = await getVideosAccoringToQuery({
    query: searchParams.query,
  });

  //@ts-ignore
  const mixedArray: Video[] & User[] = [
    ...videosAndUsers?.videos!,
    ...videosAndUsers?.users!,
  ];

  const shuffleArray = (array: Video[] & User[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  // @ts-ignore
  const shuffledArray = shuffleArray(mixedArray);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-auto flex w-full flex-col gap-y-5 p-4 sm:w-[calc(100%-72px)] md:w-[calc(100%-240px)]">
        {shuffleArray(mixedArray).map((item) =>
          item.hasOwnProperty("title") ? (
            <VideoUserContainer
              key={item.id}
              userId={item.userId}
              videoId={item.id}
              title={item.title}
              thumbnail={item.thumbnail}
              views={item.views}
              description={item.description}
              createdAt={item.createdAt}
            />
          ) : (
            <FetchUserContainer key={item.id} userId={item.id} />
          ),
        )}
      </div>
    </div>
  );
};

export default Results;
