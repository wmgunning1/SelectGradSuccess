import BaseAboutButton, { AboutButtonProps } from '@/components/BaseAboutButton';
import { useGetAboutQuery } from '@/services/dotnetBaseV1_0/dotnetBaseApi';

const LegacyAboutButton = ({ handleData }: AboutButtonProps) => (
  <BaseAboutButton handleData={handleData} label="Legacy About" useGetAboutQuery={useGetAboutQuery} />
);

export default LegacyAboutButton;
