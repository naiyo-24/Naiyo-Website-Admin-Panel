export default function RecentTransactions() {
  const TX = [
    { id: "01e4dsa", user: "johndoe", date: "2021-09-01", amount: "$43.95" },
    { id: "0315dsa", user: "jackdower", date: "2022-04-01", amount: "$133.45" },
  ];

  return (
    <>
      <style>{`
        .tx-card {
          background: #1f2937;
          padding: 20px;
          border-radius: 14px;
          color: white;
          height: 100%;
        }

        .tx-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #374151;
        }

        .tx-amount {
          background: #22c55e;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 13px;
        }

        .muted {
          color: #9ca3af;
          font-size: 12px;
        }
      `}</style>

      <div className="tx-card">
        <h4>Recent Transactions</h4>
        {TX.map(t => (
          <div className="tx-row" key={t.id}>
            <div>
              <strong>{t.id}</strong>
              <div className="muted">{t.user}</div>
            </div>
            <div className="muted">{t.date}</div>
            <span className="tx-amount">{t.amount}</span>
          </div>
        ))}
      </div>
    </>
  );
}
