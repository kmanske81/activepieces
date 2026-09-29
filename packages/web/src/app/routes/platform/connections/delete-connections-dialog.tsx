import {
  AppConnectionScope,
  PlatformAppConnectionsListItem,
} from '@activepieces/shared';
import { t } from 'i18next';

import { ConfirmationDeleteDialog } from '@/components/custom/delete-dialog';
import { TextWithTooltip } from '@/components/custom/text-with-tooltip';
import { platformAppConnectionsMutations } from '@/features/platform-admin';
import { getProjectName } from '@/features/projects';

export const DeleteConnectionsDialog = ({
  connections,
  open,
  onOpenChange,
  onDeleted,
}: DeleteConnectionsDialogProps) => {
  const { mutateAsync: deleteConnections } =
    platformAppConnectionsMutations.useDelete();
  const flows = breakingFlowsOf({ connections });
  const sharesGlobally = connections.some(
    (connection) => connection.scope === AppConnectionScope.PLATFORM,
  );
  const [single] = connections;

  return (
    <ConfirmationDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        connections.length === 1 && single
          ? t('Delete {name}?', { name: single.displayName })
          : t(
              '{count, plural, =1 {Delete 1 connection?} other {Delete # connections?}}',
              { count: connections.length },
            )
      }
      message={
        sharesGlobally
          ? t(
              '{count, plural, =1 {The credentials are removed from the platform and from every project the connection is shared with.} other {Their credentials are removed from the platform and from every project they are shared with.}} Nothing is changed at the provider.',
              { count: connections.length },
            )
          : t(
              '{count, plural, =1 {The credentials are removed from the platform.} other {Their credentials are removed from the platform.}} Nothing is changed at the provider.',
              { count: connections.length },
            )
      }
      warning={flows.length > 0 ? <BreakingFlows flows={flows} /> : undefined}
      entityName={t('connections')}
      buttonText={t('Delete')}
      mutationFn={async () => {
        const { failed } = await deleteConnections(connections);
        onDeleted({ deleted: connections.length - failed.length });
      }}
    />
  );
};

const BreakingFlows = ({ flows }: { flows: BreakingFlow[] }) => {
  const shown = flows.slice(0, MAX_FLOWS_LISTED);
  const hidden = flows.length - shown.length;
  return (
    <div className="grid grid-cols-1 gap-2">
      <span>
        {t('{count, plural, =1 {Used by 1 flow:} other {Used by # flows:}}', {
          count: flows.length,
        })}
      </span>
      <ul className="grid grid-cols-1 gap-1">
        {shown.map((flow) => (
          <li key={flow.id} className="min-w-0">
            <TextWithTooltip tooltipMessage={flowLabel(flow)}>
              <p className="truncate">
                <span className="font-medium">{flow.displayName}</span>
                {flow.projectName && (
                  <span className="text-gray-11"> · {flow.projectName}</span>
                )}
              </p>
            </TextWithTooltip>
          </li>
        ))}
        {hidden > 0 && (
          <li className="text-gray-11">
            {t('and {count} more', { count: hidden })}
          </li>
        )}
      </ul>
    </div>
  );
};

function flowLabel(flow: BreakingFlow): string {
  return flow.projectName
    ? `${flow.displayName} · ${flow.projectName}`
    : flow.displayName;
}

function breakingFlowsOf({
  connections,
}: {
  connections: PlatformAppConnectionsListItem[];
}): BreakingFlow[] {
  const byId = new Map<string, BreakingFlow>();
  connections.forEach((connection) =>
    connection.flows.forEach((flow) => {
      if (byId.has(flow.id)) {
        return;
      }
      const project = connection.projects.find(
        (candidate) => candidate.id === flow.projectId,
      );
      byId.set(flow.id, {
        ...flow,
        projectName: project ? getProjectName(project) : undefined,
      });
    }),
  );
  return [...byId.values()];
}

const MAX_FLOWS_LISTED = 5;

type BreakingFlow = PlatformAppConnectionsListItem['flows'][number] & {
  projectName: string | undefined;
};

type DeleteConnectionsDialogProps = {
  connections: PlatformAppConnectionsListItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: ({ deleted }: { deleted: number }) => void;
};
