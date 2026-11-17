import { Check, MapPin, Pencil, Plus, Trash2 } from "lucide-react"
import { Controller, type UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import SuccessMessage from "@/components/SuccessMessage"
import AddressCombobox from "@/components/AddressCombobox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { UserAddress } from "@/features/auth/auth.schema"
import type { AddressForm } from "@/features/profile/profile.schema"
import { cn } from "@/lib/utils"

interface ShippingAddressSectionProps {
  addresses: UserAddress[]
  form: UseFormReturn<AddressForm>
  message: string
  error: string
  provinces: { code: number; name: string }[]
  wards: { code: number; name: string }[]
  selectedProvinceCode: string
  isLoadingProvinces: boolean
  isLoadingWards: boolean
  provinceError: string
  wardError: string
  isFormOpen: boolean
  editingAddressId: string | null
  onOpenNew: () => void
  onOpenEdit: (address: UserAddress) => void
  onProvinceChange: (provinceCode: string) => void
  onRetryProvinces: () => void
  onRetryWards: () => void
  onClose: () => void
  onSave: (data: AddressForm) => Promise<void>
  onSetDefault: (addressId: string) => Promise<void>
  onDelete: (address: UserAddress) => Promise<void>
}

function ShippingAddressSection({
  addresses,
  form,
  message,
  error,
  provinces,
  wards,
  selectedProvinceCode,
  isLoadingProvinces,
  isLoadingWards,
  provinceError,
  wardError,
  isFormOpen,
  editingAddressId,
  onOpenNew,
  onOpenEdit,
  onProvinceChange,
  onRetryProvinces,
  onRetryWards,
  onClose,
  onSave,
  onSetDefault,
  onDelete,
}: ShippingAddressSectionProps) {
  const { errors, isSubmitting } = form.formState

  return (
    <Card id="shipping-addresses" className="scroll-mt-6">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle>Địa chỉ giao hàng</CardTitle>
          <CardDescription>
            Quản lý các địa chỉ nhận hàng của bạn.
          </CardDescription>
        </div>
        {!isFormOpen && (
          <Button onClick={onOpenNew} type="button" variant="outline">
            <Plus aria-hidden="true" data-icon="inline-start" />
            Thêm địa chỉ
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && (
          <p aria-live="polite" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {message && (
          <SuccessMessage message={message} />
        )}

        {isFormOpen && (
          <form
            className="flex flex-col gap-5 rounded-xl border bg-muted/20 p-4"
            noValidate
            onSubmit={form.handleSubmit(onSave)}
          >
            <h3 className="font-medium text-foreground">
              {editingAddressId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h3>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.label}>
                <FieldLabel htmlFor="address-label">Tên địa chỉ</FieldLabel>
                <Input
                  id="address-label"
                  placeholder="Nhà riêng, công ty..."
                  aria-invalid={!!errors.label}
                  {...form.register("label")}
                />
                <FieldError>{errors.label?.message}</FieldError>
              </Field>
              <Field data-invalid={!!errors.streetAddress}>
                <FieldLabel htmlFor="address-street">
                  Địa chỉ chi tiết
                </FieldLabel>
                <Input
                  autoComplete="street-address"
                  id="address-street"
                  placeholder="Số nhà, tên đường"
                  aria-invalid={!!errors.streetAddress}
                  {...form.register("streetAddress")}
                />
                <FieldError>{errors.streetAddress?.message}</FieldError>
              </Field>
              <Controller
                control={form.control}
                name="provinceCode"
                render={({ field }) => (
                  <Field data-invalid={!!errors.provinceCode}>
                    <FieldLabel htmlFor="address-province">
                      Tỉnh / Thành phố
                    </FieldLabel>
                    <AddressCombobox
                      describedBy="address-province-status"
                      disabled={isLoadingProvinces || !!provinceError}
                      emptyMessage="Không tìm thấy tỉnh/thành phố."
                      id="address-province"
                      inputRef={field.ref}
                      invalid={!!errors.provinceCode}
                      onBlur={field.onBlur}
                      onValueChange={(nextProvinceCode) => {
                        field.onChange(nextProvinceCode)
                        onProvinceChange(nextProvinceCode)
                      }}
                      options={provinces}
                      placeholder="Tìm hoặc chọn tỉnh / thành phố"
                      value={field.value}
                    />
                    <FieldDescription
                      aria-live="polite"
                      className={provinceError ? "text-destructive" : undefined}
                      id="address-province-status"
                    >
                      {isLoadingProvinces
                        ? "Đang tải tỉnh/thành phố..."
                        : provinceError && (
                            <>
                              {provinceError}{" "}
                              <Button
                                className="h-auto p-0"
                                onClick={onRetryProvinces}
                                size="sm"
                                type="button"
                                variant="link"
                              >
                                Thử lại
                              </Button>
                            </>
                          )}
                    </FieldDescription>
                    <FieldError>{errors.provinceCode?.message}</FieldError>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="wardCode"
                render={({ field }) => (
                  <Field data-invalid={!!errors.wardCode}>
                    <FieldLabel htmlFor="address-ward">Phường / Xã</FieldLabel>
                    <AddressCombobox
                      describedBy="address-ward-status"
                      disabled={
                        !selectedProvinceCode ||
                        isLoadingWards ||
                        !!wardError
                      }
                      emptyMessage="Không tìm thấy phường/xã."
                      id="address-ward"
                      inputRef={field.ref}
                      invalid={!!errors.wardCode}
                      onBlur={field.onBlur}
                      onValueChange={(value) => field.onChange(value)}
                      options={wards}
                      placeholder={
                        !selectedProvinceCode
                          ? "Chọn tỉnh/thành phố trước"
                          : "Tìm hoặc chọn phường / xã"
                      }
                      value={field.value}
                    />
                    <FieldDescription
                      aria-live="polite"
                      className={wardError ? "text-destructive" : undefined}
                      id="address-ward-status"
                    >
                      {isLoadingWards
                        ? "Đang tải phường/xã..."
                        : wardError && (
                            <>
                              {wardError}{" "}
                              <Button
                                className="h-auto p-0"
                                onClick={onRetryWards}
                                size="sm"
                                type="button"
                                variant="link"
                              >
                                Thử lại
                              </Button>
                            </>
                          )}
                    </FieldDescription>
                    <FieldError>{errors.wardCode?.message}</FieldError>
                  </Field>
                )}
              />
            </FieldGroup>
            <div className="flex justify-end gap-2">
              <Button onClick={onClose} type="button" variant="ghost">
                Hủy
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Đang lưu..." : "Lưu địa chỉ"}
              </Button>
            </div>
          </form>
        )}

        {addresses.length === 0 ? (
          <div className="rounded-xl border border-dashed px-5 py-8 text-center">
            <MapPin
              aria-hidden="true"
              className="mx-auto mb-2 text-muted-foreground"
            />
            <p className="font-medium text-foreground">
              Bạn chưa lưu địa chỉ nào
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Thêm địa chỉ để thuận tiện hơn khi đặt hàng.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {addresses.map((address) => (
              <li
                className={cn(
                  "flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between",
                  address.isDefault && "border-success/40 bg-success/5",
                )}
                key={address.id}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={cn(
                          "font-medium text-foreground",
                          address.isDefault && "text-success",
                        )}
                      >
                        {address.label}
                      </p>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                          <Check aria-hidden="true" className="size-3" />
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="break-words text-sm text-muted-foreground">
                      {address.street}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1 sm:justify-end">
                  {!address.isDefault && (
                    <Button
                      className="text-muted-foreground"
                      onClick={() => void onSetDefault(address.id)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Check aria-hidden="true" data-icon="inline-start" />
                      Đặt mặc định
                    </Button>
                  )}
                  <Button
                    aria-label={`Sửa địa chỉ ${address.label}`}
                    onClick={() => onOpenEdit(address)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Pencil aria-hidden="true" />
                  </Button>
                  <Button
                    aria-label={`Xóa địa chỉ ${address.label}`}
                    className="text-destructive hover:text-destructive"
                    onClick={() => void onDelete(address)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default ShippingAddressSection
