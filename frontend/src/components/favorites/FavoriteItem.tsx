import TextArea from "@/components/ui/TextArea";
import HeartIcon from "@/icons/HeartIcon";
import { FavoriteItemProps } from "@/utils/interfaces";

const FavoriteItem = ({
  sourceLanguage,
  content,
  className,
}: FavoriteItemProps) => {
  return (
    <div
      className={`w-full border-[1px] border-[#B8B8B8] lg:pt-[1.111vw] pt-[5vw] rounded-[1.111vw] ${className}`}
    >
      <span className="lg:px-[1.111vw] px-[5vw] text-[#2C734E] lg:text-[1.111vw] text-[3vw] flex items-center justify-between">
        {sourceLanguage === "nanai" ? "Нанайский" : "Русский"}
        <span className="flex lg:size-[1.806vw] size-[5vw]">
          <HeartIcon />
        </span>
      </span>
      <TextArea
        value={content}
        className="border-none lg:text-[1.667vw] text-[5vw] max-lg:p-[0] max-lg:px-[5vw] max-lg:pt-[3vw]"
        copy
        tts
        interactive={false}
        disabled
      />
    </div>
  );
};

export default FavoriteItem;
