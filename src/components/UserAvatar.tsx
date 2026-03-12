interface UserAvatarProps {
  name: string
  avatar?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
}

export default function UserAvatar({ name, avatar, size = 'md' }: UserAvatarProps) {
  const cls = sizeClasses[size]

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${cls} rounded-full object-cover ring-2 ring-primary/30`}
      />
    )
  }

  return (
    <div
      className={`${cls} rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary ring-2 ring-primary/30`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
