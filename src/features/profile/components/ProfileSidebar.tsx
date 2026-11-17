import { LockKeyhole, MapPin, UserRound } from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type { AuthUser } from "@/features/auth/auth.schema"

interface ProfileSidebarProps {
  user: AuthUser
}

function ProfileSidebar({ user }: ProfileSidebarProps) {
  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("vi")

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
      <Card>
        <CardContent className="flex items-center gap-4 pt-4">
          <div
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {user.fullName}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <nav aria-label="Điều hướng hồ sơ">
        <Card>
          <CardContent className="flex flex-col gap-1 p-2">
            <a className="profile-nav-link" href="#personal-info">
              <UserRound aria-hidden="true" />
              Thông tin cá nhân
            </a>
            <a className="profile-nav-link" href="#shipping-addresses">
              <MapPin aria-hidden="true" />
              Địa chỉ giao hàng
            </a>
            <a className="profile-nav-link" href="#security">
              <LockKeyhole aria-hidden="true" />
              Bảo mật
            </a>
          </CardContent>
        </Card>
      </nav>
    </aside>
  )
}

export default ProfileSidebar
