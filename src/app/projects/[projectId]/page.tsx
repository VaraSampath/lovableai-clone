interface pageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const page = async ({ params }: pageProps) => {
  const { projectId } = await params;

  return <div>{projectId}</div>;
};

export default page;
