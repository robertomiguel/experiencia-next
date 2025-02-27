interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
  activeSlider: string | null;
  setActiveSlider: (id: string | null) => void;
  id: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
  activeSlider,
  setActiveSlider,
  id,
}) => (
  <div className="mb-3">
    <label
      className={`block mb-1 font-medium ${activeSlider && activeSlider !== id ? "opacity-20" : ""}`}
    >
      {label}:
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step="0.01"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onMouseDown={() => setActiveSlider(id)}
      onMouseUp={() => setActiveSlider(null)}
      onTouchStart={() => setActiveSlider(id)}
      onTouchEnd={() => setActiveSlider(null)}
      className={`w-full ${activeSlider && activeSlider !== id ? "opacity-20" : ""}`}
    />
    <div
      className={`flex justify-between text-sm ${activeSlider && activeSlider !== id ? "opacity-20" : ""}`}
    >
      <span>
        {min}
        {suffix}
      </span>
      <span className="font-medium">
        {value.toFixed(2)}
        {suffix}
      </span>
      <span>
        {max}
        {suffix}
      </span>
    </div>
  </div>
);
