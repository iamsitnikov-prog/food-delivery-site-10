import React from 'react';
import type { LucideProps } from 'lucide-react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  ClipboardCheck,
  Clock,
  FileBarChart,
  FileSignature,
  Gift,
  GraduationCap,
  Headset,
  Loader2,
  Megaphone,
  Menu,
  MessageCircle,
  MessagesSquare,
  PartyPopper,
  Percent,
  Phone,
  PhoneCall,
  Quote,
  Search,
  Send,
  ShieldCheck,
  Star,
  Timer,
  TrendingUp,
  UserCheck,
  Users,
  UtensilsCrossed,
  Video,
  X,
} from 'lucide-react';

const ICONS: Record<string, React.FC<LucideProps>> = {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  ClipboardCheck,
  Clock,
  FileBarChart,
  FileSignature,
  Gift,
  GraduationCap,
  Headset,
  Loader2,
  Megaphone,
  Menu,
  MessageCircle,
  MessagesSquare,
  PartyPopper,
  Percent,
  Phone,
  PhoneCall,
  Quote,
  Search,
  Send,
  ShieldCheck,
  Star,
  Timer,
  TrendingUp,
  UserCheck,
  Users,
  UtensilsCrossed,
  Video,
  X,
};

interface IconProps extends LucideProps {
  name: string;
  fallback?: string;
}

const Icon: React.FC<IconProps> = ({ name, fallback = 'CircleAlert', ...props }) => {
  const IconComponent = ICONS[name] || ICONS[fallback];

  if (!IconComponent) {
    return <span className="text-xs text-gray-400">[icon]</span>;
  }

  return <IconComponent {...props} />;
};

export default Icon;
