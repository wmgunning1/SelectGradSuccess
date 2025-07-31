import { FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

export enum Pages {
  Home,
  SelectGradSuccess,
  SelectGradSuccessPredictor,
  SelectGradSuccessProducerDetail,
  SelectGradSuccessSharePoint,
  NotFound,
}

export type PathRouteCustomProps = {
  title?: string;
  component: FC;
  path: string;
};

export type Routes = Record<Pages, PathRouteProps & PathRouteCustomProps>;
