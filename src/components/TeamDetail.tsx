import { useState } from 'react';
import type {
  MainCharacter,
  Team,
  TeamMember,
  TeamSource,
  Element,
  Weapon,
  Effect,
  CharacterGear,
  GearSet,
} from '../types';
import { primaryWeaponIds } from '../lib/teams';

interface Lookups {
  weaponMap: Map<string, Weapon>;
  effectMap: Map<string, Effect>;
  gearMap: Map<string, CharacterGear>;
  gearSetMap: Map<string, GearSet>;
}

const ELEMENT_STYLE: Record<Element, string> = {
  物理: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  灼熱: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  寒冷: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  電磁: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  自然: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
};

const SOURCE_LABEL: Record<TeamSource, string> = {
  game8: 'Game8',
  appmedia: 'AppMedia',
};

const RARITY_COLOR: Record<number, string> = {
  6: 'text-amber-500',
  5: 'text-purple-500',
  4: 'text-blue-400',
};

export function ElementBadge({ element }: { element: Element }) {
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${ELEMENT_STYLE[element]}`}>
      {element}
    </span>
  );
}

interface CharacterTeamsProps extends Lookups {
  character: MainCharacter;
  onUseTeamWeapons: (weaponIds: string[]) => void;
}

export function CharacterTeams({ character, onUseTeamWeapons, ...lookups }: CharacterTeamsProps) {
  return (
    <div className="space-y-4">
      {character.note && (
        <p className="text-xs text-gray-600 dark:text-gray-400 border-l-2 border-gray-300 dark:border-gray-600 pl-2">
          {character.note}
        </p>
      )}
      {character.teams.map((team) => (
        <TeamCard key={team.id} team={team} onUseTeamWeapons={onUseTeamWeapons} {...lookups} />
      ))}
    </div>
  );
}

interface TeamCardProps extends Lookups {
  team: Team;
  onUseTeamWeapons: (weaponIds: string[]) => void;
}

function TeamCard({ team, onUseTeamWeapons, ...lookups }: TeamCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedMember = team.members.find((m) => m.name === selected);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">{team.label}</h3>
        {team.sources.map((s) => (
          <span
            key={s}
            className="text-xs px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
          >
            {SOURCE_LABEL[s]}
          </span>
        ))}
        <button
          onClick={() => onUseTeamWeapons(primaryWeaponIds(team))}
          className="ml-auto text-xs px-2 py-1 rounded-lg border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
        >
          この編成の武器で基質厳選 →
        </button>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300">{team.summary}</p>

      {team.note && (
        <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded px-2 py-1">
          ⚠ {team.note}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {team.members.map((m) => (
          <MemberCard
            key={m.name}
            member={m}
            active={selected === m.name}
            onClick={() => setSelected(selected === m.name ? null : m.name)}
            weaponMap={lookups.weaponMap}
          />
        ))}
      </div>

      {selectedMember && <GearPanel member={selectedMember} {...lookups} />}

      {team.substitutes.length > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
          <p className="font-medium">入替候補</p>
          {team.substitutes.map((s) => (
            <p key={s.out}>
              {s.out} → {s.candidates.join(' / ')}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

interface MemberCardProps {
  member: TeamMember;
  active: boolean;
  onClick: () => void;
  weaponMap: Map<string, Weapon>;
}

function MemberCard({ member, active, onClick, weaponMap }: MemberCardProps) {
  const isMain = member.role === 'メイン火力';
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`text-left rounded-lg border-2 p-2 transition-colors ${
        active
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`font-semibold ${isMain ? 'text-blue-600 dark:text-blue-400' : ''}`}>{member.name}</span>
        {member.form && (
          <span className="text-[10px] px-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {member.form}型
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{member.role}</p>
      <p className="text-xs">
        <span className="text-gray-400">武器 </span>
        {member.weaponIds.map((id) => weaponMap.get(id)?.name ?? id).join(' / ')}
      </p>
      <p className="text-xs">
        <span className="text-gray-400">装備 </span>
        {member.gearSets.join(' / ')}
      </p>
    </button>
  );
}

interface GearPanelProps extends Lookups {
  member: TeamMember;
}

function GearPanel({ member, weaponMap, effectMap, gearMap, gearSetMap }: GearPanelProps) {
  const gear = gearMap.get(member.name);

  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 p-3 space-y-3 text-sm">
      <p className="font-semibold">{member.name} のおすすめ装備</p>

      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">武器（この編成での推奨）</p>
        {member.weaponIds.map((id) => {
          const w = weaponMap.get(id);
          if (!w) return null;
          const effectNames = [w.baseEffect, w.additionalEffect, w.skillEffect].map(
            (e) => effectMap.get(e)?.name ?? e,
          );
          return (
            <div key={id} className="flex flex-wrap items-baseline gap-x-2">
              <span className={`text-xs font-bold ${RARITY_COLOR[w.rarity] ?? 'text-gray-400'}`}>
                {'★'.repeat(w.rarity)}
              </span>
              <span className="font-medium">{w.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{w.category}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">基質: {effectNames.join(' / ')}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">装備セット（この編成での推奨）</p>
        {member.gearSets.map((name) => (
          <div key={name}>
            <span className="font-medium">{name}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">{gearSetMap.get(name)?.effect}</span>
          </div>
        ))}
      </div>

      {gear && gear.builds.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">装備ビルド例（Game8 キャラ別おすすめ装備）</p>
          {gear.builds.map((b) => (
            <div key={b.type} className="text-xs">
              <p>
                <span className="font-medium">{b.type}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">{b.set ?? 'セット混合'}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">{b.pieces.join(' ・ ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
