package com.teachelp;

import android.app.Application;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import in.sriraman.sharedpreferences.RNSharedPreferencesReactPackage;
import cl.json.RNSharePackage;

import java.util.Arrays;
import java.util.List;
import com.fileopener.FileOpenerPackage;
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new RNFetchBlobPackage(),   
          new MainReactPackage(),
          new RNSharedPreferencesReactPackage(),
		      new RNSharePackage(),
          new FileOpenerPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
