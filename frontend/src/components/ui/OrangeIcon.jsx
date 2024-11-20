function OrangeIcon(src, p = "3", h = "8") {
  return (
    <div className={`bg-acc-02 box-content inline-block rounded-full p-${p}`}>
      <img src={src} className={`orange-filter aspect-square h-${h} w-full`} />
    </div>
  );
}

export default OrangeIcon;
