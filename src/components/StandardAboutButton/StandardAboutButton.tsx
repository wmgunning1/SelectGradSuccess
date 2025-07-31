import BaseAboutButton, { AboutButtonProps } from '@/components/BaseAboutButton';
import { useGetAboutQuery } from '@/services/dotnetBaseV2_0/dotnetBaseApi';

const StandardAboutButton = ({ handleData }: AboutButtonProps) => (
  <BaseAboutButton handleData={handleData} label="Standard About" useGetAboutQuery={useGetAboutQuery} />
);

export default StandardAboutButton;
