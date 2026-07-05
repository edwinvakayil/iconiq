"use client";

import { ChevronDown, Clock, Mail, RotateCw, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 32,
};

const MORPH_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
};

/** Bouncier spring so the active tab visibly stretches as it expands. */
const TAB_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 30,
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  /** Avatar image URL. Falls back to initials when missing or broken. */
  avatar?: string;
};

export type PendingInvite = {
  id: string;
  email: string;
  /** e.g. "Sent 2d ago". */
  sentAt?: string;
};

type TeamInvitationContextValue = {
  variant: string;
  setVariant: (variant: string) => void;
  members: TeamMember[];
  pending: PendingInvite[];
  roles: string[];
  email: string;
  setEmail: (email: string) => void;
  invite: () => void;
  changeRole: (id: string, role: string) => void;
  removeMember: (id: string) => void;
  cancelInvite: (id: string) => void;
  resend: (id: string) => void;
  onClose?: () => void;
};

const TeamInvitationContext = createContext<TeamInvitationContextValue | null>(
  null
);

function useTeamInvitationContext(component: string) {
  const context = useContext(TeamInvitationContext);

  if (!context) {
    throw new Error(`${component} must be used within <TeamInvitation>.`);
  }

  return context;
}

export type TeamInvitationProps = {
  children: ReactNode;
  /** Controlled variant when the parent owns which panel is shown. */
  variant?: string;
  /** Initial panel for uncontrolled usage. */
  defaultVariant?: string;
  onVariantChange?: (variant: string) => void;
  /** Seed member list. The block keeps a working copy for role and remove interactions. */
  members?: TeamMember[];
  /** Seed pending invite list. */
  pendingInvites?: PendingInvite[];
  /** Assignable roles shown in role dropdowns and role groups. */
  roles?: string[];
  onInvite?: (email: string) => void;
  onRoleChange?: (id: string, role: string) => void;
  onRemove?: (id: string) => void;
  onResend?: (id: string) => void;
  onCancelInvite?: (id: string) => void;
  onClose?: () => void;
  className?: string;
};

export function TeamInvitation({
  children,
  variant,
  defaultVariant = "",
  onVariantChange,
  members: seedMembers = [],
  pendingInvites: seedPending = [],
  roles = [],
  onInvite,
  onRoleChange,
  onRemove,
  onResend,
  onCancelInvite,
  onClose,
  className,
}: TeamInvitationProps) {
  const [internalVariant, setInternalVariant] = useState(defaultVariant);
  const [members, setMembers] = useState(seedMembers);
  const [pending, setPending] = useState(seedPending);
  const [email, setEmail] = useState("");

  const activeVariant = variant ?? internalVariant;

  const setVariant = useCallback(
    (next: string) => {
      if (variant === undefined) {
        setInternalVariant(next);
      }
      onVariantChange?.(next);
    },
    [variant, onVariantChange]
  );

  const changeRole = useCallback(
    (id: string, role: string) => {
      setMembers((current) =>
        current.map((member) =>
          member.id === id ? { ...member, role } : member
        )
      );
      onRoleChange?.(id, role);
    },
    [onRoleChange]
  );

  const removeMember = useCallback(
    (id: string) => {
      setMembers((current) => current.filter((member) => member.id !== id));
      onRemove?.(id);
    },
    [onRemove]
  );

  const cancelInvite = useCallback(
    (id: string) => {
      setPending((current) => current.filter((invite) => invite.id !== id));
      onCancelInvite?.(id);
    },
    [onCancelInvite]
  );

  const resend = useCallback(
    (id: string) => {
      onResend?.(id);
    },
    [onResend]
  );

  const invite = useCallback(() => {
    const value = email.trim();
    if (!value) {
      return;
    }
    setPending((current) => [
      ...current,
      { id: `invite-${Date.now()}`, email: value, sentAt: "Just now" },
    ]);
    onInvite?.(value);
    setEmail("");
  }, [email, onInvite]);

  const value = useMemo(
    () => ({
      variant: activeVariant,
      setVariant,
      members,
      pending,
      roles,
      email,
      setEmail,
      invite,
      changeRole,
      removeMember,
      cancelInvite,
      resend,
      onClose,
    }),
    [
      activeVariant,
      setVariant,
      members,
      pending,
      roles,
      email,
      invite,
      changeRole,
      removeMember,
      cancelInvite,
      resend,
      onClose,
    ]
  );

  return (
    <TeamInvitationContext.Provider value={value}>
      <div className={cn("w-full max-w-md", className)}>{children}</div>
    </TeamInvitationContext.Provider>
  );
}

export function TeamInvitationCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.section
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "relative overflow-visible rounded-3xl border border-foreground/8 bg-card p-5 sm:p-6",
        className
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
      layout
      transition={SPRING}
    >
      {children}
    </motion.section>
  );
}

export function TeamInvitationHeader({
  children,
  icon,
  className,
}: {
  children: ReactNode;
  /** Leading icon rendered in a bordered tile. */
  icon?: ReactNode;
  className?: string;
}) {
  const { onClose } = useTeamInvitationContext("TeamInvitationHeader");

  return (
    <div className={cn("flex items-start gap-4", className)}>
      {icon ? (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-foreground/10 text-foreground [&_svg]:size-5">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">{children}</div>
      {onClose ? (
        <button
          aria-label="Close"
          className="rounded-lg p-1 text-foreground transition-colors hover:bg-muted"
          onClick={onClose}
          type="button"
        >
          <X className="size-5" />
        </button>
      ) : null}
    </div>
  );
}

export function TeamInvitationTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("font-semibold text-foreground text-lg", className)}>
      {children}
    </h2>
  );
}

export function TeamInvitationDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-0.5 text-[13px] text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function TeamInvitationTabs({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className="mt-5 border-foreground/8 border-t" />
      <div className={cn("mt-4 flex items-center gap-2", className)}>
        {children}
      </div>
    </>
  );
}

export function TeamInvitationTab({
  value,
  icon,
  children,
  className,
}: {
  /** Matches the value of the TeamInvitationPanel this tab reveals. */
  value: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const { variant, setVariant } = useTeamInvitationContext("TeamInvitationTab");
  const reduceMotion = useReducedMotion() === true;
  const isActive = value === variant;

  return (
    <motion.button
      aria-pressed={isActive}
      className={cn(
        "relative flex h-9 shrink-0 items-center overflow-hidden rounded-full font-medium text-[13px] transition-colors duration-300",
        isActive
          ? "bg-foreground text-background"
          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      layout
      onClick={() => setVariant(value)}
      transition={reduceMotion ? { duration: 0 } : TAB_SPRING}
      type="button"
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
    >
      {icon ? (
        <span className="flex size-9 shrink-0 items-center justify-center [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      <AnimatePresence initial={false} mode="popLayout">
        {isActive ? (
          <motion.span
            animate={{ opacity: 1 }}
            className={cn("whitespace-nowrap pr-3.5", icon ? "" : "pl-3.5")}
            exit={{ opacity: 0 }}
            initial={reduceMotion ? false : { opacity: 0 }}
            layout="position"
            transition={reduceMotion ? { duration: 0 } : TAB_SPRING}
          >
            {children}
          </motion.span>
        ) : null}
      </AnimatePresence>
      {isActive ? null : <span className="sr-only">{children}</span>}
    </motion.button>
  );
}

export type TeamInvitationPanelProps = {
  /** Matches the value of the TeamInvitationTab that reveals this panel. */
  value: string;
  children: ReactNode;
  className?: string;
  /** Forwarded so AnimatePresence popLayout can measure and pop the exiting panel. */
  ref?: Ref<HTMLDivElement>;
};

/** Lets rows namespace their layoutId per panel so exiting and entering panels never fight over the same element. */
const PanelValueContext = createContext("");

export function TeamInvitationPanel({
  value,
  children,
  className,
  ref,
}: TeamInvitationPanelProps) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <PanelValueContext.Provider value={value}>
      <motion.div
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        className={cn("w-full", className)}
        exit={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: -10, filter: "blur(4px)" }
        }
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 14, filter: "blur(4px)" }
        }
        ref={ref}
        transition={MORPH_SPRING}
      >
        {children}
      </motion.div>
    </PanelValueContext.Provider>
  );
}

/** Identity-independent marker so children traversal survives HMR module swaps. */
TeamInvitationPanel.isTeamInvitationPanel = true;

export function TeamInvitationPanels({ children }: { children: ReactNode }) {
  const { variant } = useTeamInvitationContext("TeamInvitationPanels");
  const reduceMotion = useReducedMotion() === true;
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  // Track the active panel's natural height so the container morphs
  // smoothly between panels instead of snapping.
  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) {
      return;
    }

    const measure = () => setHeight(node.offsetHeight);

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  let active: ReactElement<TeamInvitationPanelProps> | null = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const type = child.type as { isTeamInvitationPanel?: boolean };

    if (
      (type === TeamInvitationPanel || type.isTeamInvitationPanel === true) &&
      (child.props as TeamInvitationPanelProps).value === variant
    ) {
      active = child as ReactElement<TeamInvitationPanelProps>;
    }
  });

  return (
    <motion.div
      animate={height === null ? undefined : { height }}
      className="relative overflow-visible"
      initial={false}
      transition={reduceMotion ? { duration: 0 } : MORPH_SPRING}
    >
      <div className="relative flow-root" ref={innerRef}>
        <AnimatePresence initial={false} mode="popLayout">
          {active ? cloneElement(active, { key: variant }) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function TeamInvitationSectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("font-medium text-[17px] text-foreground", className)}>
      {children}
    </h3>
  );
}

export function TeamInvitationInviteField({
  label,
  placeholder = "name@company.com",
  buttonLabel,
  className,
}: {
  label?: ReactNode;
  placeholder?: string;
  buttonLabel: ReactNode;
  className?: string;
}) {
  const { email, setEmail, invite } = useTeamInvitationContext(
    "TeamInvitationInviteField"
  );
  const reduceMotion = useReducedMotion() === true;

  return (
    <div className={cn("mt-5", className)}>
      {label ? (
        <TeamInvitationSectionLabel>{label}</TeamInvitationSectionLabel>
      ) : null}
      <div className="mt-3 flex gap-3">
        <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-foreground/8 bg-muted/40 px-4 py-3 transition-colors focus-within:border-foreground/20">
          <Mail className="size-4 shrink-0 text-muted-foreground" />
          <input
            className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                invite();
              }
            }}
            placeholder={placeholder}
            type="email"
            value={email}
          />
        </label>
        <motion.button
          className="shrink-0 rounded-xl bg-primary px-4 py-3 font-medium text-[14px] text-primary-foreground"
          onClick={invite}
          type="button"
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        >
          {buttonLabel}
        </motion.button>
      </div>
    </div>
  );
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function MemberAvatar({ member }: { member: TeamMember }) {
  const [broken, setBroken] = useState(false);

  if (member.avatar && !broken) {
    return (
      // biome-ignore lint/performance/noImgElement: registry components stay framework-agnostic.
      <img
        alt={member.name}
        className="size-12 shrink-0 rounded-full object-cover"
        height={48}
        onError={() => setBroken(true)}
        src={member.avatar}
        width={48}
      />
    );
  }

  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-foreground/8 bg-muted font-medium text-foreground text-sm">
      {initialsOf(member.name)}
    </span>
  );
}

function RoleSelect({
  role,
  roles,
  onSelect,
}: {
  role: string;
  roles: string[];
  onSelect: (role: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion() === true;

  return (
    <div
      className={cn("relative shrink-0", open && "z-[2147483647]")}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-foreground/10 px-4 py-2 text-[13px] text-foreground transition-colors hover:bg-muted/60"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {role}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="flex"
          transition={SPRING}
        >
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.ul
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute right-0 z-[2147483647] mt-2 min-w-36 origin-top-right rounded-xl border border-foreground/10 bg-card p-1 shadow-lg"
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -4 }
            }
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -4 }
            }
            transition={SPRING}
          >
            {roles.map((option) => (
              <li key={option}>
                <button
                  className={cn(
                    "w-full rounded-lg px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-muted",
                    option === role
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                  type="button"
                >
                  {option}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MemberRow({
  member,
  children,
}: {
  member: TeamMember;
  children?: ReactNode;
}) {
  const reduceMotion = useReducedMotion() === true;
  const panelValue = useContext(PanelValueContext);

  return (
    <motion.li
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, x: -12 }}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      layout
      layoutId={`team-member-${panelValue}-${member.id}`}
      transition={MORPH_SPRING}
    >
      <MemberAvatar member={member} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-[15px] text-foreground">
          {member.name}
        </span>
        <span className="block truncate text-[13px] text-muted-foreground">
          {member.email}
        </span>
      </span>
      {children}
    </motion.li>
  );
}

function EmptyRow({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.li
      animate={{ opacity: 1 }}
      className="rounded-xl border border-foreground/8 border-dashed px-4 py-3 text-[13px] text-muted-foreground"
      initial={reduceMotion ? false : { opacity: 0 }}
      layout
    >
      {children}
    </motion.li>
  );
}

export function TeamInvitationMemberList({
  label,
  action = "role",
  emptyMessage,
  className,
}: {
  label?: ReactNode;
  /** Trailing control per row: a role dropdown, a role badge with remove, or nothing. */
  action?: "role" | "remove" | "none";
  emptyMessage?: ReactNode;
  className?: string;
}) {
  const { members, roles, changeRole, removeMember } = useTeamInvitationContext(
    "TeamInvitationMemberList"
  );

  return (
    <div className={cn("mt-5", className)}>
      {label ? (
        <TeamInvitationSectionLabel>{label}</TeamInvitationSectionLabel>
      ) : null}
      <ul className="mt-4 flex flex-col gap-4">
        <AnimatePresence initial={false} mode="popLayout">
          {members.length > 0 ? (
            members.map((member) => (
              <MemberRow key={member.id} member={member}>
                {action === "role" ? (
                  <RoleSelect
                    onSelect={(role) => changeRole(member.id, role)}
                    role={member.role}
                    roles={roles}
                  />
                ) : null}
                {action === "remove" ? (
                  <>
                    <span className="rounded-full border border-foreground/10 px-3 py-1 text-[12px] text-muted-foreground">
                      {member.role}
                    </span>
                    <button
                      aria-label={`Remove ${member.name}`}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeMember(member.id)}
                      type="button"
                    >
                      <X className="size-4" />
                    </button>
                  </>
                ) : null}
              </MemberRow>
            ))
          ) : emptyMessage ? (
            <EmptyRow>{emptyMessage}</EmptyRow>
          ) : null}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export function TeamInvitationRoleGroups({
  emptyMessage,
  className,
}: {
  /** Shown under a role heading when no member holds that role. */
  emptyMessage?: ReactNode;
  className?: string;
}) {
  const { members, roles, changeRole } = useTeamInvitationContext(
    "TeamInvitationRoleGroups"
  );

  return (
    <div className={className}>
      {roles.map((role) => {
        const group = members.filter((member) => member.role === role);

        return (
          <div className="mt-5" key={role}>
            <div className="flex items-center gap-2">
              <TeamInvitationSectionLabel>{role}</TeamInvitationSectionLabel>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground tabular-nums">
                {group.length}
              </span>
            </div>
            <ul className="mt-3 flex flex-col gap-4">
              {group.length > 0 ? (
                group.map((member) => (
                  <MemberRow key={member.id} member={member}>
                    <RoleSelect
                      onSelect={(next) => changeRole(member.id, next)}
                      role={member.role}
                      roles={roles}
                    />
                  </MemberRow>
                ))
              ) : emptyMessage ? (
                <EmptyRow>{emptyMessage}</EmptyRow>
              ) : null}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export function TeamInvitationPendingList({
  label,
  emptyMessage,
  className,
}: {
  label?: ReactNode;
  emptyMessage?: ReactNode;
  className?: string;
}) {
  const { pending, resend, cancelInvite } = useTeamInvitationContext(
    "TeamInvitationPendingList"
  );
  const reduceMotion = useReducedMotion() === true;

  return (
    <div className={cn("mt-5", className)}>
      {label ? (
        <TeamInvitationSectionLabel>{label}</TeamInvitationSectionLabel>
      ) : null}
      <ul className="mt-4 flex flex-col gap-4">
        <AnimatePresence initial={false} mode="popLayout">
          {pending.length > 0 ? (
            pending.map((invite) => (
              <motion.li
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.96, x: -12 }
                }
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                key={invite.id}
                layout
                transition={MORPH_SPRING}
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-foreground/8 text-muted-foreground">
                  <Clock className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-[14px] text-foreground">
                    {invite.email}
                  </span>
                  {invite.sentAt ? (
                    <span className="block text-[13px] text-muted-foreground">
                      {invite.sentAt}
                    </span>
                  ) : null}
                </span>
                <button
                  aria-label={`Resend invite to ${invite.email}`}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => resend(invite.id)}
                  type="button"
                >
                  <RotateCw className="size-4" />
                </button>
                <button
                  aria-label={`Cancel invite to ${invite.email}`}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => cancelInvite(invite.id)}
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </motion.li>
            ))
          ) : emptyMessage ? (
            <EmptyRow>{emptyMessage}</EmptyRow>
          ) : null}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default TeamInvitation;
