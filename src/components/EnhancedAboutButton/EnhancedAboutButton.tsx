import BaseAboutButton, { AboutButtonProps } from '@/components/BaseAboutButton';
import { useGetAboutQuery } from '@/services/dotnetBaseV2_1/dotnetBaseApi';

const EnhancedAboutButton = ({ handleData }: AboutButtonProps) => (
  <BaseAboutButton handleData={handleData} label="Enhanced About" useGetAboutQuery={useGetAboutQuery} />
);

export default EnhancedAboutButton;
