import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function EmptyState({
  title,
  description,
  message,
}: {
  title: string;
  description: string;
  message: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}
