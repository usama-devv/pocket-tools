import { useState } from "react";
import {
  RotateCcw,
  Play,
  Download,
  PlusCircle,
  Clipboard,
  Edit3,
  XCircle,
  Check,
  X,
  AlertCircle,
  ChevronDown,
  PlusSquare,
  MinusSquare,
  MinusCircle,
} from "lucide-react";
import CustomSelect from "../components/CustomSelect";
import toast from "react-hot-toast";

const THEME_LIST = [
  "Default",
  "Monokai",
  "Ocean",
  "Midnight",
  "Dracula",
  "Forest",
  "Cyberpunk",
  "Solarized",
  "Twilight",
  "Nord",
  "Material",
  "Aura",
  "Synthwave",
  "Retro",
  "Slate",
  "RosePine",
  "PaleNight",
  "DeepBlue",
  "Emerald",
  "HighContrast",
];

const THEME_CONFIGS = {
  Default: {
    key: "text-[#111827]",
    valStr: "text-[#10B981]",
    valNum: "text-[#3B82F6]",
    valBool: "text-[#8B5CF6]",
    type: "text-[#6B7280]",
    bg: "bg-white",
  },
  Monokai: {
    key: "text-[#f92672]",
    valStr: "text-[#e6db74]",
    valNum: "text-[#ae81ff]",
    valBool: "text-[#66d9ef]",
    type: "text-[#9CA3AF]",
    bg: "bg-[#272822]",
  },
  Ocean: {
    key: "text-[#0077be]",
    valStr: "text-[#2e8b57]",
    valNum: "text-[#d2691e]",
    valBool: "text-[#008b8b]",
    type: "text-[#60A5FA]",
    bg: "bg-[#f0f8ff]",
  },
  Midnight: {
    key: "text-[#60A5FA]",
    valStr: "text-[#34D399]",
    valNum: "text-[#F87171]",
    valBool: "text-[#FBBF24]",
    type: "text-[#9CA3AF]",
    bg: "bg-[#111827]",
  },
  Dracula: {
    key: "text-[#bd93f9]",
    valStr: "text-[#f1fa8c]",
    valNum: "text-[#8be9fd]",
    valBool: "text-[#50fa7b]",
    type: "text-[#6272a4]",
    bg: "bg-[#282a36]",
  },
  Forest: {
    key: "text-[#2d5a27]",
    valStr: "text-[#a0522d]",
    valNum: "text-[#4682b4]",
    valBool: "text-[#8b4513]",
    type: "text-[#6B7280]",
    bg: "bg-[#f5f5dc]",
  },
  Cyberpunk: {
    key: "text-[#ff00ff]",
    valStr: "text-[#00ffff]",
    valNum: "text-[#ffff00]",
    valBool: "text-[#00ff00]",
    type: "text-[#9CA3AF]",
    bg: "bg-black",
  },
  Solarized: {
    key: "text-[#268bd2]",
    valStr: "text-[#859900]",
    valNum: "text-[#d33682]",
    valBool: "text-[#b58900]",
    type: "text-[#93a1a1]",
    bg: "bg-[#fdf6e3]",
  },
  Twilight: {
    key: "text-[#9b859d]",
    valStr: "text-[#8f9d6a]",
    valNum: "text-[#cf6a4c]",
    valBool: "text-[#7587a6]",
    type: "text-[#6B7280]",
    bg: "bg-[#141414]",
  },
  Nord: {
    key: "text-[#88c0d0]",
    valStr: "text-[#a3be8c]",
    valNum: "text-[#b48ead]",
    valBool: "text-[#ebcb8b]",
    type: "text-[#4c566a]",
    bg: "bg-[#2e3440]",
  },
  Material: {
    key: "text-[#2196f3]",
    valStr: "text-[#4caf50]",
    valNum: "text-[#ff9800]",
    valBool: "text-[#e91e63]",
    type: "text-[#9CA3AF]",
    bg: "bg-[#263238]",
  },
  Aura: {
    key: "text-[#a277ff]",
    valStr: "text-[#61ffca]",
    valNum: "text-[#ffca85]",
    valBool: "text-[#ede480]",
    type: "text-[#6B7280]",
    bg: "bg-[#15141b]",
  },
  Synthwave: {
    key: "text-[#f92aad]",
    valStr: "text-[#3fe4ef]",
    valNum: "text-[#ff8b39]",
    valBool: "text-[#fede5d]",
    type: "text-[#72f1b8]",
    bg: "bg-[#2b213a]",
  },
  Retro: {
    key: "text-[#32CD32]",
    valStr: "text-[#FFD700]",
    valNum: "text-[#FF4500]",
    valBool: "text-[#00CED1]",
    type: "text-[#6B7280]",
    bg: "bg-[#333333]",
  },
  Slate: {
    key: "text-[#E5E7EB]",
    valStr: "text-[#60A5FA]",
    valNum: "text-[#F87171]",
    valBool: "text-[#FBBF24]",
    type: "text-[#9CA3AF]",
    bg: "bg-[#1F2937]",
  },
  RosePine: {
    key: "text-[#ebbcba]",
    valStr: "text-[#f6c177]",
    valNum: "text-[#31748f]",
    valBool: "text-[#9ccfd8]",
    type: "text-[#6e6a86]",
    bg: "bg-[#191724]",
  },
  PaleNight: {
    key: "text-[#82aaff]",
    valStr: "text-[#c3e88d]",
    valNum: "text-[#f78c6c]",
    valBool: "text-[#c792ea]",
    type: "text-[#4e5579]",
    bg: "bg-[#292d3e]",
  },
  DeepBlue: {
    key: "text-[#e0e0e0]",
    valStr: "text-[#4fc3f7]",
    valNum: "text-[#fff176]",
    valBool: "text-[#81c784]",
    type: "text-[#37474f]",
    bg: "bg-[#001e3c]",
  },
  Emerald: {
    key: "text-[#10b981]",
    valStr: "text-[#059669]",
    valNum: "text-[#34d399]",
    valBool: "text-[#6ee7b7]",
    type: "text-[#6B7280]",
    bg: "bg-[#ecfdf5]",
  },
  HighContrast: {
    key: "text-white",
    valStr: "text-[#ffff00]",
    valNum: "text-[#00ffff]",
    valBool: "text-[#00ff00]",
    type: "text-[#cccccc]",
    bg: "bg-black",
  },
};

const JSONTreeTool = () => {
  const [rawJson, setRawJson] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    path: "",
    type: "",
    value: "",
    keyName: "",
  });

  const [config, setConfig] = useState({
    theme: "Default",
    iconStyle: "Triangle",
    indentWidth: 12,
    collapseBranches: "Don't Collapse",
    collapseStrings: "Don't Collapse",
    groupArrays: 100,
    displaySize: true,
    displayTypes: true,
    enableClipboard: true,
    enableAdd: true,
    enableEdit: true,
    enableDelete: true,
  });

  // Options for CustomSelect
  const themeOptions = THEME_LIST.map((theme) => ({
    value: theme,
    name: theme,
  }));
  const iconStyleOptions = [
    { value: "Triangle", name: "Triangle" },
    { value: "Square", name: "Square" },
    { value: "Circle", name: "Circle" },
  ];
  const indentOptions = [0, 1, 2, 3, 4, 5].map((num) => ({
    value: num.toString(),
    name: `${num} (${num * 6}px)`,
  }));
  const collapseOptions = [
    { value: "Don't Collapse", name: "Don't Collapse" },
    { value: "Collapse ALL", name: "Collapse ALL" },
    { value: "Collapse after 1 branch", name: "Collapse after 1 branch" },
    { value: "Collapse after 2 branches", name: "Collapse after 2 branches" },
  ];
  const stringsOptions = [
    { value: "Don't Collapse", name: "Don't Collapse" },
    { value: "5", name: "5 chars" },
    { value: "10", name: "10 chars" },
    { value: "15", name: "15 chars" },
    { value: "20", name: "20 chars" },
  ];
  const groupArraysOptions = [
    { value: "Don't Group", name: "Don't Group" },
    { value: "10", name: "10 items" },
    { value: "25", name: "25 items" },
    { value: "50", name: "50 items" },
    { value: "100", name: "100 items" },
    { value: "250", name: "250 items" },
    { value: "500", name: "500 items" },
    { value: "1000", name: "1000 items" },
  ];

  const handleParse = () => {
    try {
      const d = JSON.parse(rawJson);
      setParsedData(d);
      setError(null);
      toast.success("JSON parsed successfully!", { duration: 1500 });
    } catch {
      setError("Invalid JSON Structure!");
      toast.error("Invalid JSON Structure!", { duration: 1500 });
      setTimeout(() => setError(null), 3000);
    }
  };

  const parseValue = (val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    if (!isNaN(val) && val.trim() !== "") return Number(val);
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  };

  const handleSave = () => {
    const newData = JSON.parse(JSON.stringify(parsedData));
    const keys = modalConfig.path
      .replace(/^root\.?/, "")
      .split(".")
      .filter((k) => k !== "");
    let current = newData;

    if (keys.length === 0) {
      if (modalConfig.type === "add")
        newData[modalConfig.keyName] = parseValue(modalConfig.value);
    } else {
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      const lastKey = keys[keys.length - 1];
      if (modalConfig.type === "edit")
        current[lastKey] = parseValue(modalConfig.value);
      else if (modalConfig.type === "add") {
        if (Array.isArray(current[lastKey]))
          current[lastKey].push(parseValue(modalConfig.value));
        else
          current[lastKey][modalConfig.keyName] = parseValue(modalConfig.value);
      }
    }
    setParsedData(newData);
    setShowModal(false);
    toast.success("Node updated!", { duration: 1500 });
  };

  const downloadJSON = () => {
    if (!parsedData) {
      toast.error("No data to download!", { duration: 1500 });
      return;
    }
    const blob = new Blob([JSON.stringify(parsedData, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";
    a.click();
    toast.success("JSON downloaded!", { duration: 1500 });
  };

  const deleteNode = (path) => {
    const newData = JSON.parse(JSON.stringify(parsedData));
    const keys = path
      .replace(/^root\.?/, "")
      .split(".")
      .filter((k) => k !== "");
    if (keys.length === 0) {
      setParsedData(null);
      return;
    }
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current)) current.splice(lastKey, 1);
    else delete current[lastKey];
    setParsedData(newData);
    toast.success("Node deleted!", { duration: 1500 });
  };

  const TreeNode = ({ data, label, isLast = true, depth = 0, path = "" }) => {
    const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.Default;
    const isObject = typeof data === "object" && data !== null;
    const isArray = Array.isArray(data);

    const currentPath = path
      ? label !== null
        ? `${path}.${label}`
        : path
      : label || "";

    const [collapsed, setCollapsed] = useState(
      config.collapseBranches === "Collapse ALL" ||
        (config.collapseBranches === "Collapse after 1 branch" && depth >= 1) ||
        (config.collapseBranches === "Collapse after 2 branches" && depth >= 2)
    );

    const formatStringValue = (val) => {
      if (config.collapseStrings === "Don't Collapse") return `"${val}"`;
      const limit = parseInt(config.collapseStrings);
      return val.length > limit
        ? `"${val.substring(0, limit)}..."`
        : `"${val}"`;
    };

    const renderToggleIcon = () => {
      const iconProps = {
        size: 14,
        className:
          "cursor-pointer transition-all duration-200 text-[#3B82F6] hover:text-[#2776f5]",
        onClick: () => setCollapsed(!collapsed),
      };
      if (config.iconStyle === "Square")
        return collapsed ? (
          <PlusSquare {...iconProps} />
        ) : (
          <MinusSquare {...iconProps} />
        );
      if (config.iconStyle === "Circle")
        return collapsed ? (
          <PlusCircle {...iconProps} />
        ) : (
          <MinusCircle {...iconProps} />
        );
      return (
        <ChevronDown
          {...iconProps}
          className={`${iconProps.className} ${collapsed ? "-rotate-90" : ""}`}
        />
      );
    };

    const renderData = () => {
      const entries = Object.entries(data);
      if (
        isArray &&
        config.groupArrays !== "Don't Group" &&
        entries.length > parseInt(config.groupArrays)
      ) {
        const groupSize = parseInt(config.groupArrays);
        const groups = [];
        for (let i = 0; i < entries.length; i += groupSize)
          groups.push(entries.slice(i, i + groupSize));
        return groups.map((group, idx) => (
          <div key={idx} className="ml-4 my-1">
            <span className="text-[#6B7280] text-[10px] italic font-bold">
              [{idx * groupSize} ...{" "}
              {Math.min((idx + 1) * groupSize - 1, entries.length - 1)}]
            </span>
            {group.map(([key, value], index) => (
              <TreeNode
                key={key}
                label={null}
                data={value}
                isLast={index === group.length - 1}
                depth={depth + 1}
                path={`${currentPath}.${key}`}
              />
            ))}
          </div>
        ));
      }
      return entries.map(([key, value], index, arr) => (
        <TreeNode
          key={key}
          label={isArray ? null : key}
          data={value}
          isLast={index === arr.length - 1}
          depth={depth + 1}
          path={currentPath}
        />
      ));
    };

    return (
      <div className="ml-6 font-mono text-sm leading-relaxed">
        <div className="flex items-center group whitespace-nowrap">
          {isObject && <span className="mr-1">{renderToggleIcon()}</span>}
          {label !== null && (
            <span className={`${theme.key} mr-1`}>"{label}":</span>
          )}
          {!isObject ? (
            <span className="flex items-center">
              <span
                className={
                  typeof data === "string"
                    ? theme.valStr
                    : typeof data === "number"
                    ? theme.valNum
                    : theme.valBool
                }
              >
                {typeof data === "string"
                  ? formatStringValue(data)
                  : String(data)}
              </span>
              {config.displayTypes && (
                <span className={`ml-2 text-[10px] italic ${theme.type}`}>
                  {typeof data}
                </span>
              )}
            </span>
          ) : (
            <span className="text-[#6B7280]">{isArray ? "[" : "{"}</span>
          )}
          {isObject && config.displaySize && (
            <span className="ml-2 text-[10px] text-[#6B7280]">
              ({isArray ? data.length : Object.keys(data).length})
            </span>
          )}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 ml-4 transition-opacity px-2 bg-[#F9FAFB] rounded border border-[#E5E7EB]">
            {config.enableClipboard &&
              (copiedPath === currentPath ? (
                <Check size={12} className="text-[#10B981]" />
              ) : (
                <Clipboard
                  size={12}
                  className="text-[#3B82F6] cursor-pointer hover:text-[#2776f5]"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(data));
                    setCopiedPath(currentPath);
                    setTimeout(() => setCopiedPath(null), 1500);
                  }}
                />
              ))}
            {config.enableEdit && (
              <Edit3
                size={12}
                className="text-[#F59E0B] cursor-pointer hover:text-[#D97706]"
                onClick={() => {
                  setModalConfig({
                    path: currentPath,
                    type: "edit",
                    value: isObject ? JSON.stringify(data) : data,
                    keyName: label,
                  });
                  setShowModal(true);
                }}
              />
            )}
            {config.enableDelete && (
              <XCircle
                size={12}
                className="text-[#EF4444] cursor-pointer hover:text-[#DC2626]"
                onClick={() => deleteNode(currentPath)}
              />
            )}
            {config.enableAdd && isObject && (
              <PlusCircle
                size={12}
                className="text-[#10B981] cursor-pointer hover:text-[#059669]"
                onClick={() => {
                  setModalConfig({
                    path: currentPath,
                    type: "add",
                    value: "",
                    keyName: "newKey",
                  });
                  setShowModal(true);
                }}
              />
            )}
          </div>
        </div>
        {isObject && !collapsed && (
          <div
            className="border-l border-[#E5E7EB]"
            style={{
              marginLeft: `6px`,
              paddingLeft: `${config.indentWidth}px`,
            }}
          >
            {renderData()}
          </div>
        )}
        {isObject && (
          <div className="text-[#6B7280]">
            {collapsed ? `... ${isArray ? "]" : "}"}` : isArray ? "]" : "}"}
            {!isLast && ","}
          </div>
        )}
      </div>
    );
  };

  const handleReset = () => {
    setRawJson("");
    setParsedData(null);
    toast.success("Reset done!", { duration: 1500 });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-2 md:p-8 font-manrope relative">
      {error && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-110 flex items-center bg-[#EF4444] text-white px-4 py-2 rounded-full shadow-lg text-sm">
          <AlertCircle size={16} className="mr-2" /> {error}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm border border-[#E5E7EB]">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E7EB]">
              <h3 className="font-bold text-sm text-[#111827] uppercase">
                Edit Node
              </h3>
              <X
                className="cursor-pointer text-[#6B7280] hover:text-[#EF4444]"
                size={16}
                onClick={() => setShowModal(false)}
              />
            </div>
            {modalConfig.type === "add" && !Array.isArray(modalConfig.path) && (
              <input
                className="w-full border border-[#E5E7EB] p-3 mb-3 text-sm rounded-lg outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 text-[#111827]"
                placeholder="Key Name"
                value={modalConfig.keyName}
                onChange={(e) =>
                  setModalConfig({ ...modalConfig, keyName: e.target.value })
                }
              />
            )}
            <textarea
              className="w-full border border-[#E5E7EB] p-3 text-sm rounded-lg h-24 outline-none font-mono focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 text-[#111827]"
              placeholder="Value (String, Number, or JSON)"
              value={modalConfig.value}
              onChange={(e) =>
                setModalConfig({ ...modalConfig, value: e.target.value })
              }
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-xs border border-[#E5E7EB] bg-white rounded-full hover:bg-[#F9FAFB] text-[#6B7280]"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 text-xs bg-[#3B82F6] text-white rounded-full hover:bg-[#2776f5]"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* JSON Input */}
        <div className="relative border border-[#E5E7EB] rounded-lg bg-white focus-within:ring-2 focus-within:ring-[#3B82F6] transition-all overflow-hidden">
          <div className="sticky top-0 bg-white px-4 py-1.5 z-10 border-b border-[#E5E7EB]">
            <span className="text-[#6B7280] text-xs font-semibold uppercase tracking-wider">
              Enter Raw JSON Data
            </span>
          </div>
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            className="w-full h-64 p-4 bg-white font-mono text-sm outline-none focus:ring-0 border-none resize-none text-[#111827]"
            placeholder="Paste JSON here..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleReset}
            className="flex items-center justify-center px-10 py-3 border border-[#E5E7EB] rounded-full bg-white text-sm font-bold w-full sm:w-auto hover:bg-[#F9FAFB] hover:text-[#111827] active:scale-95 transition-all text-[#6B7280]"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </button>
          <button
            onClick={handleParse}
            className="flex items-center justify-center px-10 py-3 bg-[#3B82F6] text-white rounded-full text-sm font-bold w-full sm:w-auto hover:bg-[#2776f5] shadow-lg shadow-[#3B82F6]/20 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 mr-2 fill-current" /> Build Tree
          </button>
        </div>

        {/* JSON Tree View */}
        <div
          className={`w-full h-96 flex flex-col border border-[#E5E7EB] rounded-lg overflow-hidden ${
            THEME_CONFIGS[config.theme]?.bg || "bg-white"
          }`}
        >
          <div className="shrink-0 border-b border-[#E5E7EB] bg-white px-4 py-1.5 z-10">
            <span className="text-[#6B7280] text-xs font-semibold uppercase tracking-tight">
              JSON Tree View
            </span>
          </div>
          <div className="flex-1 overflow-auto p-2 custom-scrollbar focus:outline-none focus-within:ring-2 focus-within:ring-[#3B82F6] ring-inset">
            {parsedData ? (
              <div className="min-w-max">
                <TreeNode data={parsedData} label="root" />
              </div>
            ) : (
              <div className="p-2 text-[#9CA3AF] font-mono text-sm italic">
                Waiting for JSON input...
              </div>
            )}
          </div>
        </div>

        {/* CustomSelect Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <CustomSelect
            label="Theme"
            options={themeOptions}
            value={config.theme}
            onChange={(e) => setConfig({ ...config, theme: e.target.value })}
            size="md"
          />
          <CustomSelect
            label="Icon Style"
            options={iconStyleOptions}
            value={config.iconStyle}
            onChange={(e) =>
              setConfig({ ...config, iconStyle: e.target.value })
            }
            size="md"
          />
          <CustomSelect
            label="Indent Width"
            options={indentOptions}
            value={(config.indentWidth / 6).toString()}
            onChange={(e) =>
              setConfig({
                ...config,
                indentWidth: parseInt(e.target.value) * 6,
              })
            }
            size="md"
          />
          <CustomSelect
            label="Collapse Branches"
            options={collapseOptions}
            value={config.collapseBranches}
            onChange={(e) =>
              setConfig({ ...config, collapseBranches: e.target.value })
            }
            size="md"
          />
          <CustomSelect
            label="Collapse Strings"
            options={stringsOptions}
            value={config.collapseStrings}
            onChange={(e) =>
              setConfig({ ...config, collapseStrings: e.target.value })
            }
            size="md"
          />
          <CustomSelect
            label="Group Arrays"
            options={groupArraysOptions}
            value={config.groupArrays.toString()}
            onChange={(e) =>
              setConfig({ ...config, groupArrays: e.target.value })
            }
            size="md"
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-[#E5E7EB]">
          {Object.keys(config)
            .filter((k) => k.startsWith("display") || k.startsWith("enable"))
            .map((key) => (
              <label
                key={key}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={config[key]}
                  onChange={() => setConfig({ ...config, [key]: !config[key] })}
                  className="accent-[#3B82F6] w-4 h-4 rounded border-[#E5E7EB]"
                />
                <span className="text-sm font-medium text-[#6B7280] group-hover:text-[#111827] transition-colors capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
              </label>
            ))}
        </div>

        {/* Download Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={downloadJSON}
            className="flex items-center px-10 py-3 border-2 border-[#3B82F6] text-[#3B82F6] rounded-full font-bold hover:bg-[#F9FAFB] transition-all active:scale-95"
          >
            <Download className="w-5 h-5 mr-2" /> Download JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default JSONTreeTool;
