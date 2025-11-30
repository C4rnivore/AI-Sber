import TextArea from "@/components/ui/TextArea";
import HeartIcon from "@/icons/HeartIcon";
import { FavoriteItemProps } from "@/utils/interfaces";

const FavoriteItem = ({ sourceLanguage, content }: FavoriteItemProps) => {
  return (
    <div className="w-full border-[1px] border-[#B8B8B8] pt-[1.111vw] rounded-[1.111vw]">
      <span className="px-[1.111vw] text-[#2C734E] text-[1.111vw] flex items-center justify-between">
        {sourceLanguage === "nanai" ? "Нанайский" : "Русский"}
        <span className="flex size-[1.806vw]">
          <HeartIcon />
        </span>
      </span>
      <TextArea
        value={content}
        className="border-none text-[1.667vw]"
        copy
        tts
        interactive={false}
        disabled
      />
    </div>
  );
};

export default FavoriteItem;
