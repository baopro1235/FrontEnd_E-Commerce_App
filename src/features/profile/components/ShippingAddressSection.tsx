import { Check, MapPin, Pencil, Plus, Trash2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { UserAddress } from "@/features/auth/auth.schema"
import type { AddressForm } from "@/features/profile/profile.schema"

interface ShippingAddressSectionProps {
  addresses: UserAddress[]
  form: UseFormReturn<AddressForm>
  message: string
  error: string
  isFormOpen: boolean
  editingAddressId: string | null
  onOpenNew: () => void
  onOpenEdit: (address: UserAddress) => void
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
  isFormOpen,
  editingAddressId,
  onOpenNew,
  onOpenEdit,
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
          <p aria-live="polite" className="text-sm text-primary">
            {message}
          </p>
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
              <Field data-invalid={!!errors.street}>
                <FieldLabel htmlFor="address-street">
                  Địa chỉ chi tiết
                </FieldLabel>
                <Input
                  autoComplete="street-address"
                  id="address-street"
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                  aria-invalid={!!errors.street}
                  {...form.register("street")}
                />
                <FieldError>{errors.street?.message}</FieldError>
              </Field>
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
                className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between"
                key={address.id}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">
                        {address.label}
                      </p>
                      {address.isDefault && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
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
