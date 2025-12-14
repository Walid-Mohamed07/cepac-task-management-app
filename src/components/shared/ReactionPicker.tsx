import React from "react";

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
}

const defaultEmojis = ["👍", "❤️", "😂", "😮", "😢", "👏", "🎉", "👋"];

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect }) => {
  return (
    <div className="rounded-md bg-white shadow p-2 grid grid-cols-4 gap-2">
      {defaultEmojis.map((e) => (
        <button
          key={e}
          onClick={(ev) => {
            ev.stopPropagation();
            onSelect(e);
          }}
          className="text-lg p-1 rounded hover:bg-gray-100"
        >
          {e}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
