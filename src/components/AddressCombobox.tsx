import { useMemo, type Ref } from "react"
import { Combobox } from "@base-ui/react/combobox"
import { Check, ChevronDown } from "lucide-react"

interface AddressOption {
  code: number
  name: string
}

interface AddressComboboxProps {
  id: string
  options: readonly AddressOption[]
  value: string
  placeholder: string
  emptyMessage: string
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  inputRef?: Ref<HTMLInputElement>
  onBlur?: () => void
  onValueChange: (value: string) => void
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
}

function filterAddressOption(option: AddressOption, query: string) {
  return normalizeSearch(option.name).includes(normalizeSearch(query))
}

export default function AddressCombobox({
  id,
  options,
  value,
  placeholder,
  emptyMessage,
  disabled = false,
  invalid = false,
  describedBy,
  inputRef,
  onBlur,
  onValueChange,
}: AddressComboboxProps) {
  const items = useMemo(
    () =>
      Combobox.createItems(options, {
        getValue: (option) => String(option.code),
        getLabel: (option) => option.name,
      }),
    [options],
  )

  return (
    <Combobox.Root
      autoHighlight
      disabled={disabled}
      filter={filterAddressOption}
      inputRef={inputRef}
      items={items}
      onValueChange={(nextValue) => onValueChange(nextValue ?? "")}
      value={value || null}
    >
      <Combobox.InputGroup className="relative flex w-full items-center">
        <Combobox.Input
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent py-1 pr-9 pl-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          id={id}
          onBlur={onBlur}
          placeholder={placeholder}
        />
        <Combobox.Trigger
          aria-label="Mở danh sách"
          className="absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground outline-none"
        >
          <ChevronDown aria-hidden="true" className="size-4" />
        </Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner
          align="start"
          className="z-50 w-(--anchor-width) outline-none"
          sideOffset={4}
        >
          <Combobox.Popup className="overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md">
            <Combobox.Empty className="px-3 py-2 text-sm text-muted-foreground">
              {emptyMessage}
            </Combobox.Empty>
            <Combobox.List className="max-h-60 overflow-y-auto p-1">
              {(option: AddressOption) => (
                <Combobox.Item
                  className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                  key={option.code}
                  value={String(option.code)}
                >
                  <Combobox.ItemIndicator className="flex size-4 items-center justify-center">
                    <Check aria-hidden="true" className="size-4" />
                  </Combobox.ItemIndicator>
                  {option.name}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
