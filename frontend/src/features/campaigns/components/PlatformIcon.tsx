import { Globe, Facebook, ShoppingCart } from "lucide-react";

interface PlatformIconProps {
  platform: string;
}

export function PlatformIcon({ platform }: PlatformIconProps) {
  switch (platform.toLowerCase()) {
    case "google":
      return <Globe className="h-4 w-4 text-blue-500" />;
    case "meta":
      return <Facebook className="h-4 w-4 text-blue-700" />;
    case "amazon":
      return <ShoppingCart className="h-4 w-4 text-orange-500" />;
    default:
      return <Globe className="h-4 w-4 text-gray-500" />;
  }
}
