import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromFavourites, addToFavourites } from "../../redux/slices/favouritesSlice";

export default function CategoryCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favourites = useSelector((state) => state.favourites.items);
  const isFavourite = favourites.some((item) => item.id === product.id);

  const handleFavourite = (e) => {
    e.stopPropagation();
    if (isFavourite) {
      dispatch(removeFromFavourites(product.id));
    } else {
      dispatch(addToFavourites(product));
    }
  };

  return (
    <div
      onClick={() => navigate(`/tools/${product.category}/${product.slug}`)}
      className="
        group relative w-full h-80 bg-white rounded-[20px] p-6
        border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
        hover:border-[#3B82F6] font-manrope
        transition-all duration-300 ease-in-out
        flex flex-col cursor-pointer hover:-translate-y-1
      "
    >
      {/* Favorite Button - Top Right */}
      <button
        onClick={handleFavourite}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-transparent transition-colors duration-200"
      >
        {isFavourite ? (
          <AiFillHeart className="text-[#EF4444] text-[22px]" />
        ) : (
          <AiOutlineHeart className="text-[#9CA3AF] hover:text-[#EF4444] text-[22px]" />
        )}
      </button>

      {/* Icon Section - Clean & Fixed */}
      <div className="mb-5 flex items-center justify-start">
        <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <img
            src={`/images/${product.image}`}
            alt={product.title}
            className="w-8 h-8 object-contain"
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[1.1rem] font-bold text-[#111827] group-hover:text-[#3B82F6] transition-colors duration-200">
          {product.title}
        </h3>
        <p className="text-[0.9rem] text-[#4B5563] leading-normal line-clamp-3">
          {product.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#F3F4F6]">
        <div className="flex items-center gap-1 text-[#3B82F6] font-semibold text-[0.9rem]">
          <span>Open Tool</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </div>

        <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
          {product.category.replace(/-/g, ' ')}
        </span>
      </div>
    </div>
  );
}