import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as Qr from "qrcode";
export class QRcode implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	//显示QR码的Canvas
	private _QrCanvas : HTMLCanvasElement;
	//QR码内容
	private _Qrvalue : string;
	//右键菜单
	private _Rightclick: HTMLUListElement;
	//是否模糊
	private _Isvague : Boolean;
	constructor(){}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._Qrvalue = context.parameters.QRvalue.raw!;
		this._QrCanvas = document.createElement("canvas");
		this._Rightclick = document.createElement("ul");
		this._Isvague = false;
		//右键菜单
		if (!document.getElementById("QrRightclick")) {
		this._Rightclick.id = "QrRightclick";
		this._Rightclick.setAttribute("class", "Rightclick");
		let a = document.createElement("a");
		a.style.cursor = "pointer";
		a.style.paddingBottom="10px";
		a.textContent = "模糊QR码";
		let li: HTMLLIElement = document.createElement("li");
		li.appendChild(a);
		li.addEventListener("click",(e)=>{
			if (this._Isvague){
				this._Isvague = !this._Isvague;
				a.textContent = "模糊QR码";
				this._QrCanvas.style.filter="blur(0px)";
			}
			else {
				this._Isvague = !this._Isvague;
				a.textContent = "取消模糊QR码";
				this._QrCanvas.style.filter="blur(5px)";
			}
		})
		this._Rightclick.appendChild(li);
		document.getElementsByTagName("body")[0].appendChild(this._Rightclick);
		}
		else{
			this._Rightclick = <HTMLUListElement>document.getElementById("QrRightclick");
		}
		//隐藏右键
		document.addEventListener("click",()=>this._Rightclick.style.display="none");
		//画布
		this._QrCanvas.id = "QrCanvas";
		this._QrCanvas.style.filter="blur(0px)";
		this._QrCanvas.style.transition="filter 1.5S"
		//右键事件
		this._QrCanvas.addEventListener("contextmenu",(e)=>{
			e.preventDefault();
			//显示右键
			this._Rightclick.style.display="block";
			//获取右键栏高度宽度
			let RightclickW:number = this._Rightclick.offsetWidth;
			let RightclickH:number = this._Rightclick.offsetHeight;
			//设置位置
			let X:number = e.clientX + RightclickW > document.body.clientWidth ? e.clientX - RightclickW : e.clientX;
			let Y:number = e.clientY + RightclickH > document.body.clientHeight ? e.clientY - RightclickH : e.clientY;
			this._Rightclick.style.left=X+'px';
			this._Rightclick.style.top=Y+'px';
		})
		container.appendChild(this._QrCanvas);
		//生成QR码
		Qr.toCanvas(this._QrCanvas,this._Qrvalue,{errorCorrectionLevel:"L",version:0},(error)=>{
			console.log(error.message);
		});
	}
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this._Qrvalue = context.parameters.QRvalue.raw!;
		Qr.toCanvas(this._QrCanvas,this._Qrvalue,{errorCorrectionLevel:"L",version:0},(error)=>{
			console.log(error.message);
		});
	}
	public getOutputs(): IOutputs
	{
		return {};
	}
	public destroy(): void
	{
	}
}