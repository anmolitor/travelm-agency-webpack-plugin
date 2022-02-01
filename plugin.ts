import fs from "fs";
import path from "path";
import * as T from "travelm_agency";
import { ResponseContent } from "travelm_agency/lib/elm.min";
import { promisify } from "util";
import { Compiler, sources, WebpackPluginInstance } from "webpack";

class TravelmAgencyPlugin implements WebpackPluginInstance {
  private ranOnce = false;
  private responseContent: ResponseContent | undefined;

  constructor(private readonly options: T.Options) {
    this.runTravelmAgency = this.runTravelmAgency.bind(this);
    this.writeJsonFiles = this.writeJsonFiles.bind(this);
  }

  apply(compiler: Compiler) {
    compiler.hooks.beforeRun.tapPromise(TravelmAgencyPlugin.name, async () => {
      if (this.ranOnce) {
        return;
      }
      this.ranOnce = true;
      return this.runTravelmAgency(await this.getTranslationFilePaths(), false);
    });

    compiler.hooks.compilation.tap(TravelmAgencyPlugin.name, (compilation) => {
      compilation.hooks.processAssets.tap(
        TravelmAgencyPlugin.name,
        this.writeJsonFiles
      );
    });

    compiler.hooks.afterCompile.tap(TravelmAgencyPlugin.name, (compilation) => {
      compilation.contextDependencies.add(
        path.resolve(this.options.translationDir)
      );
    });

    compiler.hooks.watchRun.tapPromise(
      TravelmAgencyPlugin.name,
      async (compilation) => {
        if (
          !compilation.modifiedFiles ||
          compilation.modifiedFiles.has(
            path.resolve(this.options.translationDir)
          )
        ) {
          const translationFilePaths = await this.getTranslationFilePaths();
          return this.runTravelmAgency(translationFilePaths, true).catch(
            (err) => {
              compilation
                .getInfrastructureLogger(TravelmAgencyPlugin.name)
                .error(err);
            }
          );
        }
      }
    );
  }

  private async getTranslationFilePaths() {
    return (await promisify(fs.readdir)(this.options.translationDir)).map(
      (fileName) => path.resolve(this.options.translationDir, fileName)
    );
  }

  private async runTravelmAgency(
    translationFilePaths: string[],
    devMode: boolean
  ) {
    await T.sendTranslations(translationFilePaths, devMode);
    this.responseContent = await T.finishModule({ ...this.options, devMode });

    const shouldBeWritten = await promisify(fs.readFile)(this.options.elmPath, {
      encoding: "utf-8",
    })
      .then((data) => data !== this.responseContent?.elmFile)
      .catch(() => true);

    if (shouldBeWritten) {
      await promisify(fs.writeFile)(
        this.options.elmPath,
        this.responseContent.elmFile
      );
    }
  }

  private writeJsonFiles(assets: Record<string, sources.Source>) {
    const { options } = this;
    if (options.generatorMode === "dynamic" && this.responseContent) {
      this.responseContent.optimizedJson.forEach(({ filename, content }) => {
        if (!assets[path.join(options.jsonPath, filename)]) {
          assets[path.join(options.jsonPath, filename)] = new sources.RawSource(
            content
          );
        }
      });
    }
  }
}

export default TravelmAgencyPlugin;
