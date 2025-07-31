export type AboutButtonProps = {
  handleData: (data: string) => void;
};

export type BaseAboutButtonProps = AboutButtonProps & {
  label: string;
  useGetAboutQuery: () => {
    refetch: () => {
      unwrap: () => Promise<Record<string, unknown>>;
    };
  };
};
