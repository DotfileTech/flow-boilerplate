import { useMemo } from 'react';
import { uniqueId } from 'lodash';
import {
  useController,
  FieldValues,
  ControllerRenderProps,
  Path,
  UseControllerProps,
} from 'react-hook-form';

import { GroupControl, GroupControlProps } from './group-control';

export type GroupControllerProps<
  V extends FieldValues,
  TName extends Path<V>
> = {
  render: (
    param: ControllerRenderProps<V, TName> & { id: string; isInvalid: boolean }
  ) => React.ReactElement;
} & GroupControlProps &
  UseControllerProps<V, TName>;

export const GroupController = <V extends FieldValues, TName extends Path<V>>(
  props: GroupControllerProps<V, TName>
): JSX.Element => {
  const {
    render,
    // useController props
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    ...groupsProps
  } = props;

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
  });

  const id = useMemo(() => uniqueId(name), [name]);

  return (
    <GroupControl error={error?.message} labelFor={id} {...groupsProps}>
      {render({
        ...field,
        id,
        isInvalid: typeof error !== 'undefined' ?? false,
      })}
    </GroupControl>
  );
};
