$code = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;

public class ImageProcessor {
    public static void RemoveWhite(string inPath, string outPath) {
        Bitmap bmp = new Bitmap(inPath);
        Bitmap newBmp = new Bitmap(bmp.Width, bmp.Height, PixelFormat.Format32bppArgb);
        for(int x = 0; x < bmp.Width; x++){
            for(int y = 0; y < bmp.Height; y++){
                Color p = bmp.GetPixel(x, y);
                // Background usually F3F4F6 or FFFFFF
                if(p.R > 235 && p.G > 235 && p.B > 235) {
                    newBmp.SetPixel(x, y, Color.Transparent);
                } else if(p.R > 210 && p.G > 210 && p.B > 210) {
                    // blend edges
                    newBmp.SetPixel(x, y, Color.FromArgb(128, p.R, p.G, p.B));
                } else {
                    newBmp.SetPixel(x, y, p);
                }
            }
        }
        newBmp.Save(outPath, ImageFormat.Png);
        newBmp.Dispose();
        bmp.Dispose();
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
[ImageProcessor]::RemoveWhite("c:\Users\navaneeth k menon\Downloads\tub\logo.png", "c:\Users\navaneeth k menon\Downloads\tub\logo2.png")
