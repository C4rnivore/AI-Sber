import TextArea from "@/components/ui/TextArea";
import { HistoryItemProps } from "@/utils/interfaces";

const HistoryItem = ({
  sourceLanguage,
  content,
  onDelete,
  className,
}: HistoryItemProps & { className?: string }) => {
  return (
    <div
      className={`w-full border-[1px] border-[#B8B8B8] lg:pt-[1.111vw] pt-[5vw] rounded-[1.111vw] relative ${className}`}
    >
      <span className="lg:px-[1.111vw] px-[5vw] text-[#2C734E] lg:text-[1.111vw] text-[3vw] flex items-center justify-between">
        {sourceLanguage === "nanai" ? "Нанайский" : "Русский"}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 lg:text-[1.111vw] text-[3vw] font-semibold"
            aria-label="Удалить из истории"
          >
            ✕
          </button>
        )}
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

export default HistoryItem;
