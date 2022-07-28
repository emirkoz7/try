import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { useSearchParams } from "react-router-dom";
import { getRecommendGenres2 } from "../../services/search";
import { SUPPORTED_QUERY } from "../../shared/constants";
import { getRecommendGenres2Type } from "../../shared/types";

interface FilterByGenresProps {
  currentTab: string;
}

const FilterByGenres: FunctionComponent<FilterByGenresProps> = ({
  currentTab,
}) => {
  const [genres] = useAutoAnimate();
  const { isLoading, data, isError, error } = useQuery<
    getRecommendGenres2Type,
    Error
  >(["genres"], getRecommendGenres2);

  const [searchParam, setSearchParam] = useSearchParams();

  // const currentSearchParams = {} as any;
  // const QUERY_PARAMS_THAT_SHARE_SAME_NAME: { [key: string]: string[] } = {
  //   genre: [],
  // };

  // searchParam.forEach((value, key) => {
  //   if (key in QUERY_PARAMS_THAT_SHARE_SAME_NAME) {
  //     QUERY_PARAMS_THAT_SHARE_SAME_NAME[key].push(value);
  //   }
  //   currentSearchParams[key] = value;
  // });

  if (isError) return <div>ERROR: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  const chooseGenre = (genreId: string) => {
    // STEP 1
    const currentSearchParams = JSON.parse(JSON.stringify(SUPPORTED_QUERY)) as {
      [key: string]: string[];
    };

    searchParam.forEach((value, key) => {
      currentSearchParams[key].push(value);
    });

    // STEP 2
    const existingGenres = searchParam.getAll("genre");

    if (existingGenres.includes(genreId)) {
      const newGenres = existingGenres.filter(
        (genre: string) => genre !== genreId
      );
      setSearchParam({
        ...currentSearchParams,
        genre: newGenres,
      });
    } else {
      setSearchParam({
        ...currentSearchParams,
        genre: [...existingGenres, genreId],
      });
    }
  };

  return (
    <ul
      // @ts-ignore
      ref={genres}
      className="flex gap-3 flex-wrap max-h-[200px] overflow-y-auto"
    >
      {currentTab === "movie" &&
        data.movieGenres.map((genre) => (
          <li key={genre.id}>
            <button
              onClick={() => chooseGenre(String(genre.id))}
              className={`px-4 py-1 border border-[#989898] rounded-full hover:brightness-75 transition duration-300 inline-block ${
                searchParam.getAll("genre").includes(String(genre.id)) &&
                "bg-primary text-white"
              }`}
            >
              {genre.name}
            </button>
          </li>
        ))}
      {currentTab === "tv" &&
        data.tvGenres.map((genre) => (
          <li key={genre.id}>
            <button
              onClick={() => chooseGenre(String(genre.id))}
              className={`px-4 py-1 border border-[#989898] rounded-full hover:brightness-75 transition duration-300 inline-block ${
                searchParam.getAll("genre").includes(String(genre.id)) &&
                "bg-primary text-white"
              }`}
            >
              {genre.name}
            </button>
          </li>
        ))}
    </ul>
  );
};

export default FilterByGenres;

// to={`/explore?genre=${encodeURIComponent(genre.id)}`}
