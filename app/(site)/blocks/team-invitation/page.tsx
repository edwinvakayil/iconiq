"use client";

import { Clock, ShieldCheck, UserPlus, Users } from "lucide-react";

import { teamInvitationApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  TeamInvitation,
  TeamInvitationCard,
  TeamInvitationDescription,
  TeamInvitationHeader,
  TeamInvitationInviteField,
  TeamInvitationMemberList,
  TeamInvitationPanel,
  TeamInvitationPanels,
  TeamInvitationPendingList,
  TeamInvitationRoleGroups,
  TeamInvitationTab,
  TeamInvitationTabs,
  TeamInvitationTitle,
} from "@/registry/team-invitation";

const usageCode = `"use client";

import { Clock, ShieldCheck, UserPlus, Users } from "lucide-react";
import {
  TeamInvitation,
  TeamInvitationCard,
  TeamInvitationDescription,
  TeamInvitationHeader,
  TeamInvitationInviteField,
  TeamInvitationMemberList,
  TeamInvitationPanel,
  TeamInvitationPanels,
  TeamInvitationPendingList,
  TeamInvitationRoleGroups,
  TeamInvitationTab,
  TeamInvitationTabs,
  TeamInvitationTitle,
} from "@/components/ui/team-invitation";

const members = [
  {
    id: "trevor",
    name: "Trevor Phillips",
    email: "trevorphillips@gmail.com",
    role: "Assistant",
    avatar: "/assets/av1.png",
  },
  {
    id: "michael",
    name: "Michael De Santa",
    email: "michaeldesanta@gmail.com",
    role: "Junior Level",
    avatar: "/assets/av2.png",
  },
  {
    id: "franklin",
    name: "Franklin Clinton",
    email: "franklinclinton@gmail.com",
    role: "Senior Level",
    avatar: "/assets/av3.png",
  }
];

export function TeamInvitationPreview() {
  return (
    <TeamInvitation
      defaultVariant="invite"
      members={members}
      onInvite={(email) => console.log("invite", email)}
      onRoleChange={(id, role) => console.log(id, role)}
      pendingInvites={[
        { id: "jhon", email: "jhon@wick.com", sentAt: "Sent 2d ago" },
      ]}
      roles={["Assistant", "Junior Level", "Senior Level"]}
    >
      <TeamInvitationCard>
        <TeamInvitationHeader icon={<Users />}>
          <TeamInvitationTitle>Invite Team Member</TeamInvitationTitle>
          <TeamInvitationDescription>
            Share tasks with other users
          </TeamInvitationDescription>
        </TeamInvitationHeader>
        <TeamInvitationTabs>
          <TeamInvitationTab icon={<UserPlus />} value="invite">
            Invite Members
          </TeamInvitationTab>
          <TeamInvitationTab icon={<Users />} value="manage">
            Manage Team
          </TeamInvitationTab>
          <TeamInvitationTab icon={<ShieldCheck />} value="roles">
            Role Management
          </TeamInvitationTab>
          <TeamInvitationTab icon={<Clock />} value="pending">
            Pending Invites
          </TeamInvitationTab>
        </TeamInvitationTabs>
        <TeamInvitationPanels>
          <TeamInvitationPanel value="invite">
            <TeamInvitationInviteField
              buttonLabel="Invite Member"
              label="Email"
            />
            <TeamInvitationMemberList action="role" label="Member Lists" />
          </TeamInvitationPanel>
          <TeamInvitationPanel value="manage">
            <TeamInvitationMemberList
              action="remove"
              emptyMessage="No members yet. Invite someone first."
              label="Team Members"
            />
          </TeamInvitationPanel>
          <TeamInvitationPanel value="roles">
            <TeamInvitationRoleGroups emptyMessage="No members with this role yet." />
          </TeamInvitationPanel>
          <TeamInvitationPanel value="pending">
            <TeamInvitationPendingList
              emptyMessage="No pending invites. Invite someone from the Invite Members tab."
              label="Pending Invites"
            />
          </TeamInvitationPanel>
        </TeamInvitationPanels>
      </TeamInvitationCard>
    </TeamInvitation>
  );
}`;

const members = [
  {
    id: "trevor",
    name: "Trevor Phillips",
    email: "trevorphillips@gmail.com",
    role: "Assistant",
    avatar: "/assets/av1.png",
  },
  {
    id: "michael",
    name: "Michael De Santa",
    email: "michaeldesanta@gmail.com",
    role: "Junior Level",
    avatar: "/assets/av2.png",
  },
  {
    id: "franklin",
    name: "Franklin Clinton",
    email: "franklinclinton@gmail.com",
    role: "Senior Level",
    avatar: "/assets/av3.png",
  },
];

function TeamInvitationPreview() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-10">
      <TeamInvitation
        defaultVariant="invite"
        members={members}
        onInvite={(email) => console.log("invite", email)}
        onRoleChange={(id, role) => console.log(id, role)}
        pendingInvites={[
          { id: "jhon", email: "jhon@wick.com", sentAt: "Sent 2d ago" },
        ]}
        roles={["Assistant", "Junior Level", "Senior Level"]}
      >
        <TeamInvitationCard>
          <TeamInvitationHeader icon={<Users />}>
            <TeamInvitationTitle>Invite Team Member</TeamInvitationTitle>
            <TeamInvitationDescription>
              Share tasks with other users
            </TeamInvitationDescription>
          </TeamInvitationHeader>
          <TeamInvitationTabs>
            <TeamInvitationTab icon={<UserPlus />} value="invite">
              Invite Members
            </TeamInvitationTab>
            <TeamInvitationTab icon={<Users />} value="manage">
              Manage Team
            </TeamInvitationTab>
            <TeamInvitationTab icon={<ShieldCheck />} value="roles">
              Role Management
            </TeamInvitationTab>
            <TeamInvitationTab icon={<Clock />} value="pending">
              Pending Invites
            </TeamInvitationTab>
          </TeamInvitationTabs>
          <TeamInvitationPanels>
            <TeamInvitationPanel value="invite">
              <TeamInvitationInviteField
                buttonLabel="Invite Member"
                label="Email"
              />
              <TeamInvitationMemberList action="role" label="Member Lists" />
            </TeamInvitationPanel>
            <TeamInvitationPanel value="manage">
              <TeamInvitationMemberList
                action="remove"
                emptyMessage="No members yet. Invite someone first."
                label="Team Members"
              />
            </TeamInvitationPanel>
            <TeamInvitationPanel value="roles">
              <TeamInvitationRoleGroups emptyMessage="No members with this role yet." />
            </TeamInvitationPanel>
            <TeamInvitationPanel value="pending">
              <TeamInvitationPendingList
                emptyMessage="No pending invites. Invite someone from the Invite Members tab."
                label="Pending Invites"
              />
            </TeamInvitationPanel>
          </TeamInvitationPanels>
        </TeamInvitationCard>
      </TeamInvitation>
    </div>
  );
}

export default function TeamInvitationPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Team Invitation" },
      ]}
      componentName="team-invitation"
      description="Compound team invitation block with fluid morphing variant tabs, an invite form, member lists with role dropdowns, role groups, and pending invites."
      details={teamInvitationApiDetails}
      detailsDescription="TeamInvitation is a compound component: the root owns the active variant, member, pending, and email state and provides it through context, while TeamInvitationCard, TeamInvitationHeader, TeamInvitationTitle, TeamInvitationDescription, TeamInvitationTabs, TeamInvitationTab, TeamInvitationPanels, TeamInvitationPanel, and the section parts compose the card. Tabs and panels pair through a shared value, so you define your own variants — none of the labels, icons, or copy are hardcoded. The variant can be uncontrolled through defaultVariant or fully controlled through variant and onVariantChange."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/team-invitation/page.tsx`}
      itemSlug="team-invitation"
      pageUrl="/blocks/team-invitation"
      preview={<TeamInvitationPreview />}
      previewClassName="min-h-[38rem]"
      previewDescription="Switch tabs to morph between variants — the active icon tab stretches open to reveal its label while its neighbors slide aside, panels crossfade through a soft blur, and member rows keep their identity as they fly between role groups or collapse away on removal."
      title="Team Invitation"
      usageCode={usageCode}
      usageDescription="Compose `TeamInvitation` from its parts: put `TeamInvitationTitle` and `TeamInvitationDescription` inside the header, add a `TeamInvitationTab` per variant with your own value, icon, and label, and pair each with a `TeamInvitationPanel` of the same value inside `TeamInvitationPanels`. Fill panels with `TeamInvitationInviteField`, `TeamInvitationMemberList`, `TeamInvitationRoleGroups`, and `TeamInvitationPendingList`, or your own content. Seed data with `members`, `pendingInvites`, and `roles`; avatars fall back to initials when an image is missing or fails."
    />
  );
}
