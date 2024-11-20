function OrangeIcon({ src, p, h }) {
  // const cn = `p-${p}`;
  // const cn2 = ` h-${h}`;
  return (
    <div
      className={"bg-acc-02 box-content inline-block rounded-full"}
      style={{ padding: p }}
    >
      <img
        src={src}
        alt="icon"
        style={{ height: h }}
        className={"orange-filter aspect-square"}
      />
    </div>
  );
}

export default OrangeIcon;
