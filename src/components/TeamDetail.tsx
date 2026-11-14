import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type {
  MainCharacter,
  Team,
  TeamMember,
  TeamSource,
  Weapon,
  Effect,
  CharacterGear,
  GearSet,
} from '../types';
import { primaryWeaponIds } from '../lib/teams';
import { raritySx, toneTextSx, tokenSx } from '../theme';
import { Chevron } from './Chevron';
import { Tag } from './ui';

interface Lookups {
  weaponMap: Map<string, Weapon>;
  effectMap: Map<string, Effect>;
  gearMap: Map<string, CharacterGear>;
  gearSetMap: Map<string, GearSet>;
}

const SOURCE_LABEL: Record<TeamSource, string> = {
  game8: 'Game8',
  appmedia: 'AppMedia',
};

/** 小見出し（詳細パネル内のラベル） */
function Label({ children }: { children: string }) {
  return (
    <Typography component="p" variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
      {children}
    </Typography>
  );
}

interface CharacterTeamsProps extends Lookups {
  character: MainCharacter;
  onUseTeamWeapons: (weaponIds: string[]) => void;
}

export function CharacterTeams({ character, onUseTeamWeapons, ...lookups }: CharacterTeamsProps) {
  return (
    <Stack spacing={3} divider={<Divider flexItem />}>
      {character.note && (
        <Typography variant="body2" color="text.secondary">
          {character.note}
        </Typography>
      )}
      {character.teams.map((team) => (
        <TeamSection key={team.id} team={team} onUseTeamWeapons={onUseTeamWeapons} {...lookups} />
      ))}
    </Stack>
  );
}

interface TeamSectionProps extends Lookups {
  team: Team;
  onUseTeamWeapons: (weaponIds: string[]) => void;
}

function TeamSection({ team, onUseTeamWeapons, ...lookups }: TeamSectionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedMember = team.members.find((m) => m.name === selected);

  return (
    <Box component="section">
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="h3" component="h3">{team.label}</Typography>
        {team.sources.map((s) => (
          <Tag key={s} tone="neutral" outlined>{SOURCE_LABEL[s]}</Tag>
        ))}
        <Button
          size="small"
          variant="outlined"
          onClick={() => onUseTeamWeapons(primaryWeaponIds(team))}
          sx={[
            { ml: 'auto', whiteSpace: 'nowrap', py: 0.25 },
            tokenSx((t) => ({ color: t.accentInk, borderColor: t.accentInk })),
          ]}
        >
          この編成の武器で基質厳選 →
        </Button>
      </Stack>

      <Typography variant="body2">{team.summary}</Typography>

      {team.note && (
        <Typography variant="caption" component="p" color="text.secondary" sx={{ mt: 1 }}>
          <Box component="span" sx={[{ fontWeight: 700, mr: 0.5 }, toneTextSx('split')]}>注意：</Box>
          {team.note}
        </Typography>
      )}

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gap: 1,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
        }}
      >
        {team.members.map((m) => (
          <MemberTile
            key={m.name}
            member={m}
            open={selected === m.name}
            onClick={() => setSelected(selected === m.name ? null : m.name)}
            weaponMap={lookups.weaponMap}
          />
        ))}
      </Box>

      {selectedMember && <GearDetail member={selectedMember} {...lookups} />}

      {team.substitutes.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Label>入替候補</Label>
          {team.substitutes.map((s) => (
            <Typography key={s.out} variant="caption" component="p" color="text.secondary">
              {s.out} → {s.candidates.join(' / ')}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}

interface MemberTileProps {
  member: TeamMember;
  open: boolean;
  onClick: () => void;
  weaponMap: Map<string, Weapon>;
}

function MemberTile({ member, open, onClick, weaponMap }: MemberTileProps) {
  const isMain = member.role === 'メイン火力';
  return (
    <ButtonBase
      onClick={onClick}
      aria-expanded={open}
      sx={[
        (theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          textAlign: 'left',
          p: 1.5,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: theme.transitions.create('border-color', { duration: theme.transitions.duration.shorter }),
          '&:hover': { borderColor: 'text.disabled' },
        }),
        open ? tokenSx((t) => ({ borderColor: t.accentInk, boxShadow: `inset 0 0 0 1px ${t.accentInk}` })) : {},
      ]}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        <Typography
          component="span"
          sx={[{ fontWeight: 700 }, isMain ? tokenSx((t) => ({ color: t.accentInk })) : {}]}
        >
          {member.name}
        </Typography>
        {member.form && <Tag tone="neutral">{member.form}型</Tag>}
      </Stack>
      <Typography variant="caption" color="text.secondary" component="span">{member.role}</Typography>
      <Typography variant="caption" component="span" sx={{ mt: 1 }}>
        <Box component="span" sx={{ color: 'text.disabled', mr: 1 }}>武器</Box>
        {member.weaponIds.map((id) => weaponMap.get(id)?.name ?? id).join(' / ')}
      </Typography>
      <Typography variant="caption" component="span">
        <Box component="span" sx={{ color: 'text.disabled', mr: 1 }}>装備</Box>
        {member.gearSets.join(' / ')}
      </Typography>
      <Stack
        direction="row"
        sx={[{ alignItems: 'center', gap: 0.5, mt: 'auto', pt: 1, fontSize: '0.75rem', fontWeight: 600 }, tokenSx((t) => ({ color: t.accentInk }))]}
      >
        <Chevron open={open} />
        {open ? '閉じる' : '装備を見る'}
      </Stack>
    </ButtonBase>
  );
}

interface GearDetailProps extends Lookups {
  member: TeamMember;
}

function GearDetail({ member, weaponMap, effectMap, gearMap, gearSetMap }: GearDetailProps) {
  const gear = gearMap.get(member.name);

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
      <Typography variant="h3" component="p" sx={{ mb: 1.5 }}>{member.name} のおすすめ装備</Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 1.4fr)' },
        }}
      >
        <Box>
          <Label>武器（この編成での推奨）</Label>
          <Stack spacing={1}>
            {member.weaponIds.map((id) => {
              const w = weaponMap.get(id);
              if (!w) return null;
              const effectNames = [w.baseEffect, w.additionalEffect, w.skillEffect].map(
                (e) => effectMap.get(e)?.name ?? e,
              );
              return (
                <Box key={id}>
                  <Typography component="p" sx={{ fontWeight: 600 }}>
                    <Box component="span" sx={[{ fontSize: '0.75rem', mr: 1 }, raritySx(w.rarity)]}>
                      {'★'.repeat(w.rarity)}
                    </Box>
                    {w.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="p">
                    {w.category} ・ 基質 {effectNames.join(' / ')}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>

        <Box>
          <Label>装備セット（この編成での推奨）</Label>
          <Stack spacing={1}>
            {member.gearSets.map((name) => (
              <Box key={name}>
                <Typography component="p" sx={{ fontWeight: 600 }}>{name}</Typography>
                <Typography variant="caption" color="text.secondary" component="p">
                  {gearSetMap.get(name)?.effect}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {gear && gear.builds.length > 0 && (
          <Box>
            <Label>装備ビルド例（Game8）</Label>
            <Stack spacing={1}>
              {gear.builds.map((b) => (
                <Box key={b.type}>
                  <Typography variant="body2" component="p" sx={{ fontWeight: 600 }}>
                    {b.type}
                    <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary', ml: 1 }}>
                      {b.set ?? 'セット混合'}
                    </Box>
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="p">
                    {b.pieces.join(' ・ ')}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
