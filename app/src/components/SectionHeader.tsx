export default function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <div className="mb-[3px] font-display text-[20px] font-bold text-dk">{title}</div>
      <div className="mb-4 text-[13px] text-mu">{sub}</div>
    </>
  );
}
