import SearchInput from "./SearchInput";

export default function Header() {
  return <div className="flex flex-row gap-4 pt-8 items-center">
    <div className="shrink-0 text-lg leading-none min-w-100">Story beats</div>
    <SearchInput />
  </div>
}