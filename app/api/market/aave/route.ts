import { NextResponse } from "next/server";
import { ethers } from "ethers";

const AAVE_LENDING_POOL_ABI = [
  "function getUserAccountData(address user) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
];
const AAVE_LENDING_POOL_ADDRESS = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"; // Mainnet v2

export async function GET(request: Request) {
  const user = new URL(request.url).searchParams.get("user");
  if (!user) return NextResponse.json({ error: "Missing user address" }, { status: 400 });

  const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
  const contract = new ethers.Contract(AAVE_LENDING_POOL_ADDRESS, AAVE_LENDING_POOL_ABI, provider);

  try {
    const data = await contract.getUserAccountData(user);
    return NextResponse.json({
      totalCollateralETH: data.totalCollateralETH.toString(),
      totalDebtETH: data.totalDebtETH.toString(),
      availableBorrowsETH: data.availableBorrowsETH.toString(),
      currentLiquidationThreshold: data.currentLiquidationThreshold.toString(),
      ltv: data.ltv.toString(),
      healthFactor: data.healthFactor.toString(),
    });
  } catch (e) {
    console.error("Aave API error:", e);
    return NextResponse.json({ error: "Failed to fetch Aave account data" }, { status: 500 });
  }
} 